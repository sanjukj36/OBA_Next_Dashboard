import { readFileSync } from "fs";
import path from "path";
import { TSESLint } from "@typescript-eslint/utils";

function getTagLists() {
  try {
    const configPath = path.join(__dirname, "../config/tag-list.config.json");
    const configData = readFileSync(configPath, "utf-8");
    return JSON.parse(configData) as Record<
      string,
      {
        importName: string;
        totalTags: number;
      }
    >;
  } catch (error) {
    console.error("Error loading tag lists config:", error);
    return {};
  }
}

const TAG_LISTS = getTagLists();

const rule: TSESLint.RuleModule<"duplicateTag" | "missingTags"> = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce proper usage of tag lists",
      url: ""
    },
    messages: {
      duplicateTag:
        "Duplicate {{ prefix }} tag usage: {{ tag }}. First usage at line {{ firstLine }}",
      missingTags:
        "Not all {{ prefix }} tags are used. Missing tags: {{ missingTags }}"
    },
    schema: [],
    fixable: undefined,
    hasSuggestions: false
  },
  defaultOptions: [],
  create(context) {
    const tagListUsage = Object.entries(TAG_LISTS).reduce(
      (acc, [prefix, config]) => {
        acc[prefix] = {
          usedTags: new Set<number>(),
          tagLocations: new Map<number, { line: number; column: number }>(),
          totalTags: config.totalTags,
          importName: config.importName
        };
        return acc;
      },
      {} as Record<
        string,
        {
          usedTags: Set<number>;
          tagLocations: Map<number, { line: number; column: number }>;
          totalTags: number;
          importName: string;
        }
      >
    );

    return {
      MemberExpression(node) {
        if (
          node.property.type === "Identifier" &&
          /^Tag\d+$/.test(node.property.name)
        ) {
          const tagNum = parseInt(node.property.name.replace("Tag", ""), 10);
          const sourceCode = context.getSourceCode();
          const text = sourceCode.getText(node);

          for (const [prefix, config] of Object.entries(tagListUsage)) {
            if (
              node.object.type === "Identifier" &&
              node.object.name === config.importName
            ) {
              const { usedTags, tagLocations } = tagListUsage[prefix];

              if (usedTags.has(tagNum)) {
                const firstUsage = tagLocations.get(tagNum);
                context.report({
                  node,
                  messageId: "duplicateTag",
                  data: {
                    prefix,
                    tag: text,
                    firstLine: firstUsage?.line ?? "unknown"
                  }
                });
              } else {
                usedTags.add(tagNum);
                tagLocations.set(tagNum, {
                  line: node.loc.start.line,
                  column: node.loc.start.column
                });
              }
              break;
            }
          }
        }
      },
      "Program:exit"() {
        for (const [prefix, config] of Object.entries(tagListUsage)) {
          if (
            config.usedTags.size > 0 &&
            config.usedTags.size < config.totalTags
          ) {
            const missingTags = Array.from(
              { length: config.totalTags },
              (_, i) => i + 1
            ).filter(tag => !config.usedTags.has(tag));

            if (missingTags.length > 0) {
              context.report({
                loc: { line: 1, column: 1 },
                messageId: "missingTags",
                data: {
                  prefix,
                  missingTags: missingTags.join(", ")
                }
              });
            }
          }
        }
      }
    };
  }
};

export const rules = {
  "no-tag-misuse": rule
};
