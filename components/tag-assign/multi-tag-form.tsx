"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Info, Plus, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { updateTagApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { getCurrentTagDetailsQueryKey } from "@/queries/use-get-tag-details-query";
import { getLatestDataByLabelQueryKey } from "@/queries/use-latest-data-by-label";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import { TagAssign, TagDataType } from "@/types/tag-assign";
import { IconStatus, OptionType, radioOptions, TagInfo } from ".";
import { ConfirmationModal } from "./confirm-modal";
import { CustomSelect } from "./custom-select";
import { DataTable } from "./data-table";
import { BoolResponseSelection } from "./input-label";
import { BoolResponseType } from "./single-tag-form";
import { VirtualizedCombobox } from "./virtualized-combobox";

interface MultipleItemFormProps {
  label: string;
  setPopoverOpen: (open: boolean) => void;
  modalState: boolean;
  setModalState: (state: boolean) => void;
  setIconStatus: (status: IconStatus) => void;
  className?: string;
  data?: TagAssign<BoolResponseType>[];
  allTagList: { value: string; label: string }[];
}

type FormTagInfo = TagInfo<BoolResponseType>[];

export function MultiTagBoolForm({
  label,
  setPopoverOpen,
  modalState,
  setModalState,
  setIconStatus,
  className,
  data,
  allTagList
}: MultipleItemFormProps) {
  const [tagInfo, setTagInfo] = useState<FormTagInfo>(() => {
    if (data && data.length > 0) {
      const newData = data.map(item => {
        const tag = allTagList.find(i => i.value === item.actual_tag);
        const dataType = radioOptions.find(i => i.value === item.datatype);
        return {
          description: item.description,
          tag: tag ?? null,
          datatype: dataType ?? null,
          unit: item.unit,
          minimum: item.minimum,
          maximum: item.maximum,
          response_type: item.response_type ?? {
            "0": "grey",
            "1": "grey"
          }
        };
      }) as FormTagInfo;
      return newData;
    } else {
      return [
        {
          description: "",
          tag: null,
          datatype: radioOptions[0],
          unit: "",
          minimum: 0,
          maximum: 0,
          response_type: {
            "0": "grey",
            "1": "grey"
          }
        }
      ];
    }
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const quryClient = useQueryClient();

  const handleCancelFormChanges = () => {
    setModalState(true);
  };

  const hadleUpdateTag = async () => {
    const data: TagAssign<BoolResponseType>[] = [];

    if (!vessel || !vessel.id) return toast.error("User not found.");
    if (!token) return toast.error("Token not found.");

    for (const x of tagInfo) {
      if (!x.tag) return toast.error("Tag Missing");
      if (x.datatype?.value === TagDataType.Float) {
        if (!x.unit) return toast.error("Unit Missing");
        if (x.minimum === undefined || x.minimum === null)
          return toast.error("Minimum Missing");
        if (x.maximum === undefined || x.maximum === null)
          return toast.error("Maximum Missing");
      }
      const tagAssign: TagAssign<BoolResponseType> = {
        actual_tag: x.tag.value,
        tag_from_vessel: x.tag.value,
        description: x.description,
        datatype: x.datatype.value,
        unit: x.unit,
        minimum: x.minimum,
        maximum: x.maximum,
        response_type: x.response_type
      };
      data.push(tagAssign);
    }

    try {
      setLoading(true);
      const res = await updateTagApi(
        { vesselId: vessel.id, data, label },
        token
      );
      if (res.data.success) {
        await Promise.all([
          quryClient.invalidateQueries({
            queryKey: getCurrentTagDetailsQueryKey(
              label,
              vessel.imo ?? "",
              token ?? ""
            )
          }),
          quryClient.invalidateQueries({
            queryKey: getLatestDataByLabelQueryKey(
              label,
              vessel.imo ?? "",
              token ?? ""
            )
          })
        ]);
        if (res.data.data.tag_data.length > 0) {
          setIconStatus("complete");
        } else {
          setIconStatus("incomplete");
        }
        toast.success(res.data.message);
        setPopoverOpen(false);
      } else {
        throw new Error(res.data.message ?? "Unknown error occured.");
      }
    } catch (err) {
      // TODO: Error state. YC
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRow = (rowIndex: number) => {
    setTagInfo(prev => prev.filter((_info, index) => rowIndex !== index));
  };

  const handleAddRow = () => {
    setTagInfo(prev => [
      ...prev,
      {
        description: "",
        tag: null,
        datatype: radioOptions[0],
        unit: "",
        minimum: 0,
        maximum: 0,
        response_type: {
          "0": "grey",
          "1": "grey"
        }
      }
    ]);
  };

  const columns = useMemo<ColumnDef<TagInfo<BoolResponseType>>[]>(
    () => [
      {
        accessorKey: "description",
        header: () => (
          <div className="flex gap-1">
            <p>Description</p>
            <TooltipProvider delayDuration={0} disableHoverableContent>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={18} strokeWidth={3} />
                </TooltipTrigger>
                <TooltipContent className="max-w-56">
                  Tag displayed in the AMS UI. Defaults to the vessel&apos;s
                  tag.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
        cell: ({ row }) => {
          const handleInputChange = (value: string) => {
            setTagInfo(prevInfo =>
              prevInfo.map((info, index) =>
                index === row.index ? { ...info, description: value } : info
              )
            );
          };
          return (
            <Input
              className="min-w-[250px] rounded-lg border-primary/50 bg-none shadow-none focus-visible:ring-primary/50"
              type="text"
              placeholder="Enter Description"
              value={row.original.description}
              onChange={e => handleInputChange(e.target.value)}
            />
          );
        }
      },
      {
        accessorKey: "actualTag",
        header: () => (
          <div className="flex gap-1">
            <p>Actual Tag</p>
            <TooltipProvider delayDuration={0} disableHoverableContent>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={18} strokeWidth={3} />
                </TooltipTrigger>
                <TooltipContent className="max-w-56">
                  Tag from vessel (required). Without it, data won&apos;t appear
                  in the UI.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
        cell: ({ row }) => {
          const handleInputChange = (value: OptionType) => {
            setTagInfo(prevInfo =>
              prevInfo.map((info, index) =>
                index === row.index ? { ...info, tag: value } : info
              )
            );
          };
          return (
            <VirtualizedCombobox
              className="min-w-[250px]"
              options={allTagList ?? []}
              selectedOption={row.original.tag}
              setSelectedOption={handleInputChange}
            />
          );
        }
      },
      {
        accessorKey: "dataType",
        header: "Data Type",
        cell: ({ row }) => {
          const handleInputChange = (value: {
            value: TagDataType;
            label: TagDataType;
          }) => {
            setTagInfo(prevInfo =>
              prevInfo.map((info, index) =>
                index === row.index ? { ...info, datatype: value } : info
              )
            );
          };
          return (
            <CustomSelect
              className="w-[100px] rounded-lg border-primary/50"
              options={radioOptions}
              selection={row.original.datatype}
              setSelection={value =>
                handleInputChange(
                  value as {
                    value: TagDataType;
                    label: TagDataType;
                  }
                )
              }
              // optimized={false}
            />
          );
        }
      },
      {
        accessorKey: "response_type",
        header: "Reponse Type",
        cell: ({ row }) => {
          const handleInputChange = (value: BoolResponseType) => {
            setTagInfo(prevInfo =>
              prevInfo.map((info, index) =>
                index === row.index ? { ...info, response_type: value } : info
              )
            );
          };
          return (
            <BoolResponseSelection
              className="col-span-2 min-w-52"
              onValueChange={handleInputChange}
              value={row.original.response_type}
              disabled={row.original.datatype.value === TagDataType.Float}
            />
          );
        }
      },
      {
        accessorKey: "unit",
        header: "Unit",
        cell: ({ row }) => {
          const handleInputChange = (value: string) => {
            setTagInfo(prevInfo =>
              prevInfo.map((info, index) =>
                index === row.index ? { ...info, unit: value } : info
              )
            );
          };
          return (
            <Input
              className="max-w-[80px] rounded-lg border-primary/50 bg-none shadow-none focus-visible:ring-primary/50"
              type="text"
              placeholder="Enter unit"
              value={row.original.unit}
              onChange={e => handleInputChange(e.target.value)}
              disabled={row.original.datatype?.value === TagDataType.Bool}
            />
          );
        }
      },
      {
        accessorKey: "min",
        header: "Min",
        cell: ({ row }) => {
          const handleInputChange = (value: number) => {
            setTagInfo(prevInfo =>
              prevInfo.map((info, index) =>
                index === row.index ? { ...info, minimum: value } : info
              )
            );
          };
          return (
            <Input
              className="max-w-[80px] rounded-lg border-primary/50 bg-none shadow-none focus-visible:ring-primary/50"
              type="text"
              placeholder="Enter min"
              value={row.original.minimum}
              onChange={e => {
                let inputValue = e.target.value;
                if (inputValue === "") {
                  handleInputChange(0);
                  return;
                }
                if (inputValue.length > 1) {
                  inputValue = inputValue.replace(/^0+/, "");
                }
                const parsed = parseInt(inputValue, 10);
                handleInputChange(isNaN(parsed) ? 0 : parsed);
              }}
              disabled={row.original.datatype?.value === TagDataType.Bool}
            />
          );
        }
      },
      {
        accessorKey: "max",
        header: "Max",
        cell: ({ row }) => {
          const handleInputChange = (value: number) => {
            setTagInfo(prevInfo =>
              prevInfo.map((info, index) =>
                index === row.index ? { ...info, maximum: value } : info
              )
            );
          };
          return (
            <Input
              className="max-w-[80px] rounded-lg border-primary/50 bg-none shadow-none focus-visible:ring-primary/50"
              type="number"
              placeholder="Enter max"
              value={row.original.maximum}
              onChange={e => {
                let inputValue = e.target.value;
                if (inputValue === "") {
                  handleInputChange(0);
                  return;
                }
                if (inputValue.length > 1) {
                  inputValue = inputValue.replace(/^0+/, "");
                }
                const parsed = parseInt(inputValue, 10);
                handleInputChange(isNaN(parsed) ? 0 : parsed);
              }}
              disabled={row.original.datatype?.value === TagDataType.Bool}
            />
          );
        }
      },
      {
        id: "actions",
        enableHiding: true,
        cell: ({ row }) => {
          return (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteRow(row.index)}
            >
              <Trash2 size={16} strokeWidth={3} />
            </Button>
          );
        }
      }
    ],
    [setTagInfo]
  );

  return (
    <div className={twMerge("grid min-w-[1172px] gap-2 p-4", className)}>
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Button variant="success" size="icon" onClick={handleAddRow}>
          <Plus size={16} strokeWidth={3} />
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tagInfo}
        pagination={false}
        filter={false}
        sort={false}
      />

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          className="border-input/50"
          onClick={handleCancelFormChanges}
        >
          Cancel
        </Button>
        <Button loading={loading} onClick={hadleUpdateTag}>
          Update
        </Button>
      </div>
      <ConfirmationModal
        open={modalState}
        onOpenChange={setModalState}
        onConfirmClick={() => setPopoverOpen(false)}
      />
    </div>
  );
}
