import { useTranslation } from "next-i18next";
import React from "react";
import { ExpandRow } from "~/components/ui/ExpandRow";
import { RecapSkeleton } from "~/components/ui/skeletons/RecapSkeleton";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import RecapCard from "../RecapCard";

const TagsCard = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("home");
  const { data, isError, isLoading } = api.tags.orderTagsByName.useQuery(
    undefined,
    {
      onSuccess(data) {
        if (data.length === 0) {
          const msg = t("tags.empty");
          setMessage(msg);
        }
      },
      onError() {
        const msg = t("tags.error");
        setMessage(msg);
      },
    }
  );

  return (
    <RecapCard loading={isLoading} fallback={<RecapSkeleton />}>
      <RecapCard.Header>{t("tags.most_used")}</RecapCard.Header>
      <RecapCard.Container error={isError}>
        {data &&
          data.map((tag) => (
            <div
              key={tag.name}
              className="flex w-full justify-between gap-2 p-4 font-medium"
            >
              <p>{tag.name}</p>
              <div className="flex w-1/2 flex-row-reverse">
                <ExpandRow
                  color={getColorByValue(
                    tag._count.name,
                    data[0]?._count.name ?? 0
                  )}
                  value={`${tag._count.name}`}
                  width={getWidthByValue(
                    tag._count.name,
                    data[0]?._count.name ?? 0
                  )}
                />
              </div>
            </div>
          ))}
      </RecapCard.Container>
    </RecapCard>
  );
};

export default TagsCard;

function floorValue(value: number, max: number, ceil: number) {
  return Math.floor((ceil * value) / max);
}
function getWidthByValue(value: number, max: number) {
  return floorValue(value, max, 100);
}

function getColorByValue(value: number, max: number) {
  const saturation = floorValue(128, value, max);
  return `hsl(${saturation}, 50%, 65%)`;
}
