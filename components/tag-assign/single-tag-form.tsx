import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { updateTagApi } from "@/lib/api";
import { useAuth } from "@/provider/auth-provider";
import { getCurrentTagDetailsQueryKey } from "@/queries/use-get-tag-details-query";
import { getLatestDataByLabelQueryKey } from "@/queries/use-latest-data-by-label";
import { useVesselSelectionStore } from "@/store/vessel-selection-store";
import { TagAssign, TagDataType } from "@/types/tag-assign";
import { IconStatus, OptionType, radioOptions, TagInfo } from ".";
import { tagAssignTypeConfig } from "./config";
import { ConfirmationModal } from "./confirm-modal";
import { InputLabelComponent } from "./input-label";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface SingleItemBoolStatusFormProps {
  label: string;
  setPopoverOpen: (open: boolean) => void;
  modalState: boolean;
  setModalState: (state: boolean) => void;
  setIconStatus: (status: IconStatus) => void;
  data?: TagAssign<BoolResponseType>;
  allTagList: { value: string; label: string }[];
}

export const boolResponseStatusList =
  tagAssignTypeConfig.boolResponse.statusList;
export const boolResponseStatusListItems =
  tagAssignTypeConfig.boolResponse.statusListItem;

export type BoolResponseStatusValue = (typeof boolResponseStatusList)[number];
export type BoolResponseStatusKeys =
  (typeof boolResponseStatusListItems)[number];

export type BoolResponseType = {
  [K in BoolResponseStatusKeys]: BoolResponseStatusValue;
};

type FormTagInfo = TagInfo<BoolResponseType>;

export function SingleTagBoolForm({
  label,
  setPopoverOpen,
  modalState,
  setModalState,
  setIconStatus,
  data,
  allTagList
}: SingleItemBoolStatusFormProps) {
  const [tagInfo, setTagInfo] = useState<FormTagInfo>(() => {
    if (data && Object.keys(data).length > 0) {
      const tag = allTagList.find(i => i.value === data.actual_tag);
      const dataType = radioOptions.find(i => i.value === data.datatype);
      return {
        description: data.description,
        showOnlyDescription: data.showOnlyDescription,
        tag: tag ?? null,
        datatype: dataType ?? null,
        unit: data.unit,
        minimum: data.minimum,
        maximum: data.maximum,
        response_type: data.response_type ?? {
          "0": "grey",
          "1": "grey"
        }
      } as FormTagInfo;
    } else {
      return {
        description: "",
        showOnlyDescription: false,
        tag: null,
        datatype: radioOptions[0],
        unit: "",
        minimum: 0,
        maximum: 0,
        response_type: {
          "0": "red",
          "1": "green"
        }
      };
    }
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const quryClient = useQueryClient();

  const handleInputChange = (
    type: keyof typeof tagInfo,
    value: string | number | OptionType | BoolResponseType | boolean | null
  ) => {
    setTagInfo(prev => ({ ...prev, [type]: value }));
  };

  const handleCancelFormChanges = () => {
    setModalState(true);
  };

  const hadleUpdateTag = async () => {
    // if (!vessel || !vessel.id) return toast.error("User not found.");
    // if (!token) return toast.error("Token not found.");

    const vessel = { id: 111111 }; // Replace with actual vessel retrieval logic

    const {
      tag,
      datatype,
      unit,
      minimum,
      maximum,
      description,
      response_type,
      showOnlyDescription
    } = tagInfo;

    if (!description) return toast.error("Description Missing");
    if(!showOnlyDescription) {
      if (!tag) return toast.error("Tag Missing");
      if (!datatype) return toast.error("Datatype Missing");
      if (datatype.value === TagDataType.Float) {
        if (!unit) return toast.error("Unit Missing");
        if (minimum === undefined || minimum === null)
          return toast.error("Minimum Missing");
        if (maximum === undefined || maximum === null)
          return toast.error("Maximum Missing");
      }
    }

    const data: TagAssign<BoolResponseType>[] = [
      {
        actual_tag: tag?.value ?? "",
        showOnlyDescription: showOnlyDescription ?? false,
        tag_from_vessel: tag?.value ?? "",
        datatype: datatype?.value ?? "",
        description: description,
        unit,
        minimum: minimum,
        maximum: maximum,
        response_type: response_type
      }
    ];

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
              vessel.id ?? "",
              token ?? ""
            )
          }),
          quryClient.invalidateQueries({
            queryKey: getLatestDataByLabelQueryKey(
              label,
              vessel.id ?? "",
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

  const hadleDeleteTag = async () => {
    if (!vessel || !vessel.id) return toast.error("User not found.");
    if (!token) return toast.error("Token not found.");

    const data: TagAssign<BoolResponseType>[] = [];

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
              vessel.id ?? "",
              token ?? ""
            )
          }),
          quryClient.invalidateQueries({
            queryKey: getLatestDataByLabelQueryKey(
              label,
              vessel.id ?? "",
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

  return (
    <div className="grid w-96 gap-2 p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>

      <div className="w-ful flex gap-2 items-center">
        <Label>Show only Description</Label>
        <Switch
          checked={tagInfo.showOnlyDescription}
          onCheckedChange={value => handleInputChange("showOnlyDescription", value)}
          className="relative h-4 w-7 border border-white/90 data-[state=checked]:bg-slate-950 data-[state=unchecked]:bg-slate-950 2xl:h-5 2xl:w-9"
          thumbClassName="data-[state=unchecked]:translate-x-0.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:2xl:translate-x-[17px] h-2.5 w-2.5 2xl:h-3.5 2xl:w-3.5"
        />
      </div>
      <InputLabelComponent
        label="Description"
        info="This is the Tag will apear in the AMS UI. By default it will show the TAG from Vessel"
        type="text"
        placeholder="Description"
        value={tagInfo.description}
        onValueChange={value => handleInputChange("description", value)}
      />
      <InputLabelComponent
        label="Actual Tag"
        info="Tag from vessel. This field is required. Unless any data won't be show in the UI"
        disabled={tagInfo.showOnlyDescription}
        type="select"
        placeholder="Tag from Vessel"
        value={tagInfo.tag}
        onValueChange={value => {
          handleInputChange("tag", value)
          if (tagInfo.description === "") {
            handleInputChange("description", value.label)
          }
        }}
        options={allTagList ?? []}
      />
      <InputLabelComponent
        label="Data Type"
        disabled={tagInfo.showOnlyDescription}
        type="radio"
        value={tagInfo.datatype}
        onValueChange={value => handleInputChange("datatype", value)}
        options={radioOptions}
      />
      <InputLabelComponent
        label="Response Type"
        type="bool-response"
        value={tagInfo.response_type}
        onValueChange={value => handleInputChange("response_type", value)}
        options={radioOptions}
        disabled={tagInfo.showOnlyDescription || tagInfo.datatype?.value === TagDataType.Float}
      />
      <InputLabelComponent
        label="Unit"
        type="text"
        placeholder="Unit of the Tag"
        value={tagInfo.unit}
        onValueChange={value => handleInputChange("unit", value)}
        disabled={tagInfo.showOnlyDescription || tagInfo.datatype?.value === TagDataType.Bool}
      />
      <InputLabelComponent
        label="Min"
        type="number"
        placeholder="Min value"
        value={tagInfo.minimum}
        onValueChange={value => handleInputChange("minimum", value)}
        disabled={tagInfo.showOnlyDescription || tagInfo.datatype?.value === TagDataType.Bool}
      />
      <InputLabelComponent
        label="Max"
        type="number"
        placeholder="Max value"
        value={tagInfo.maximum}
        onValueChange={value => handleInputChange("maximum", value)}
        disabled={tagInfo.showOnlyDescription || tagInfo.datatype?.value === TagDataType.Bool}
      />
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          loading={loading}
          variant="destructive"
          onClick={hadleDeleteTag}
        >
          Delete
        </Button>
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
