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

interface SingleItemDgStatusFormProps {
  label: string;
  setPopoverOpen: (open: boolean) => void;
  modalState: boolean;
  setModalState: (state: boolean) => void;
  setIconStatus: (status: IconStatus) => void;
  data?: TagAssign<DgStatusResponseType>;
  allTagList: { value: string; label: string }[];
}

export const engineStatusList =
  tagAssignTypeConfig.boolResponseEnginStatus.statusList;
export const engineStatusListItems =
  tagAssignTypeConfig.boolResponseEnginStatus.statusListItem;

export type DgStatusValue = (typeof engineStatusList)[number];
export type DgStatusKeys = (typeof engineStatusListItems)[number];

export type DgStatusResponseType = {
  [K in DgStatusKeys]: DgStatusValue;
};

type FormTagInfo = TagInfo<DgStatusResponseType>;

export function SingleTagDgStatusForm({
  label,
  setPopoverOpen,
  modalState,
  setModalState,
  setIconStatus,
  data,
  allTagList
}: SingleItemDgStatusFormProps) {
  const [tagInfo, setTagInfo] = useState<FormTagInfo>(() => {
    if (data && Object.keys(data).length > 0) {
      const tag = allTagList.find(i => i.value === data.actual_tag);
      const dataType = radioOptions.find(i => i.value === data.datatype);
      return {
        description: data.description,
        tag: tag ?? null,
        datatype: dataType ?? null,
        unit: data.unit,
        minimum: data.minimum,
        maximum: data.maximum,
        response_type: data.response_type ?? {
          "1": "grey-1",
          "2": "grey-2",
          "3": "grey-3",
          "4": "green",
          "5": "red"
        }
      } as FormTagInfo;
    } else {
      return {
        description: "",
        tag: null,
        datatype: radioOptions[0],
        unit: "",
        minimum: 0,
        maximum: 0,
        response_type: {
          "1": "grey-1",
          "2": "grey-2",
          "3": "grey-3",
          "4": "green",
          "5": "red"
        }
      } as FormTagInfo;
    }
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { vessel } = useVesselSelectionStore();
  const quryClient = useQueryClient();

  const handleInputChange = (
    type: keyof typeof tagInfo,
    value: string | number | OptionType | DgStatusResponseType | null
  ) => {
    setTagInfo(prev => ({ ...prev, [type]: value }));
  };

  const handleCancelFormChanges = () => {
    setModalState(true);
  };

  const hadleUpdateTag = async () => {
    if (!vessel || !vessel.id) return toast.error("User not found.");
    if (!token) return toast.error("Token not found.");

    const {
      tag,
      datatype,
      unit,
      minimum,
      maximum,
      description,
      response_type
    } = tagInfo;

    if (!tag) return toast.error("Tag Missing");
    if (!datatype) return toast.error("Datatype Missing");
    if (!description) return toast.error("Description Missing");
    if (datatype.value === TagDataType.Float) {
      if (!unit) return toast.error("Unit Missing");
      if (minimum === undefined || minimum === null)
        return toast.error("Minimum Missing");
      if (maximum === undefined || maximum === null)
        return toast.error("Maximum Missing");
    }

    const data: TagAssign<DgStatusResponseType>[] = [
      {
        actual_tag: tag.value,
        tag_from_vessel: tag.value,
        datatype: datatype.value,
        description: description ? description : tag.value,
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

  return (
    <div className="grid w-[450px] gap-2 p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
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
        type="select"
        placeholder="Tag from Vessel"
        value={tagInfo.tag}
        onValueChange={value => handleInputChange("tag", value)}
        options={allTagList ?? []}
      />
      <InputLabelComponent
        label="Data Type"
        type="radio"
        value={tagInfo.datatype}
        onValueChange={value => handleInputChange("datatype", value)}
        options={radioOptions}
      />
      <InputLabelComponent
        label="Response Type"
        type="dg-status"
        value={tagInfo.response_type}
        onValueChange={value => handleInputChange("response_type", value)}
        options={radioOptions}
      />
      <InputLabelComponent
        label="Unit"
        type="text"
        placeholder="Unit of the Tag"
        value={tagInfo.unit}
        onValueChange={value => handleInputChange("unit", value)}
        disabled={tagInfo.datatype?.value === TagDataType.Bool}
      />
      <InputLabelComponent
        label="Min"
        type="number"
        placeholder="Min value"
        value={tagInfo.minimum}
        onValueChange={value => handleInputChange("minimum", value)}
        disabled={tagInfo.datatype?.value === TagDataType.Bool}
      />
      <InputLabelComponent
        label="Max"
        type="number"
        placeholder="Max value"
        value={tagInfo.maximum}
        onValueChange={value => handleInputChange("maximum", value)}
        disabled={tagInfo.datatype?.value === TagDataType.Bool}
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
