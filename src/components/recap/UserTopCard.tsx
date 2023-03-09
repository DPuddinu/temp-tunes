import { useTranslation } from "next-i18next";
import { useState } from "react";
import type { TagsObject } from "~/server/api/routers/prisma_router";
import {
  TopTypeArray,
  type Artist,
  type TimeRangeType,
  type TopType,
  type Track,
} from "~/types/spotify-types";
import { api } from "~/utils/api";
import { ArtistRow } from "../ui/ArtistRow";
import PaginationComponent from "../ui/PaginationComponent";
import TrackRow from "../ui/TrackRow";
import RecapCard from "./RecapCard";
import { RecapContainer } from "./RecapCardContainer";
import { RecapCardHeader } from "./RecapSelectItem";

export type RecapPropsType = {
  timeRange: TimeRangeType;
  tags: TagsObject | undefined;
};

export const itemsPerPageOptions = ["5", "10", "15", "20"];
export const totalItems = 50;

const UserTopCard = ({ timeRange = "short_term", tags }: RecapPropsType) => {
  const { t } = useTranslation("home");
  const [selectedType, setSelectedType] = useState<TopType>("tracks");
  const [selectedPage, setSelectedPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { data, isLoading, isError } = api.spotify_user.getTop.useQuery({
    type: selectedType,
    timeRange: timeRange,
    itemsPerPage: itemsPerPage,
    totalItems: totalItems,
  });

  return (
    <RecapCard key={"card-top-rated"} intent={"topRated"} loading={isLoading}>
      <div className="grid grid-cols-2">
        {TopTypeArray.map((type, i) => (
          <RecapCardHeader
            key={i}
            onClick={() => setSelectedType(type)}
            intent={selectedType === type ? "selected" : "primary"}
          >
            <p
              className={`${
                selectedType === type
                  ? "border  border-transparent border-b-white"
                  : ""
              } pb-2 md:text-lg`}
            >
              {t(getTranslationByType(type))}
            </p>
          </RecapCardHeader>
        ))}
      </div>
      <RecapContainer key={"container-top-rated"} error={isError}>
        {data &&
          data.items[selectedPage] &&
          data.items[selectedPage]?.map((item: Artist | Track, i) => (
            <>
              {selectedType === "artists" ? (
                <ArtistRow
                  artistImageUrl={(item as Artist).images[2]?.url}
                  label={(item as Artist).name}
                  key={i}
                />
              ) : (
                <TrackRow
                  spotifyId={item.id}
                  tagType={"track"}
                  trackTags={tags ? tags[item.id] ?? [] : []}
                  artists={(item as Track).artists.map((artist) => artist.name)}
                  label={item.name}
                  key={i}
                />
              )}
            </>
          ))}

        <PaginationComponent
          activePage={selectedPage}
          setActivePage={setSelectedPage}
          itemsPerPage={itemsPerPage}
          totalItems={data?.totalItems ?? 0}
          key={"pagination"}
        ></PaginationComponent>
      </RecapContainer>
    </RecapCard>
  );
};

export default UserTopCard;

function getTranslationByType(type: TopType) {
  switch (type) {
    case "artists":
      return "recap.top_artists";
    case "tracks":
      return "recap.top_tracks";
  }
}
