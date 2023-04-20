import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useTagsStore } from "~/core/store";
import {
  TopTypeArray,
  type Artist,
  type TimeRangeType,
  type TopType,
  type Track,
} from "~/types/spotify-types";
import { api } from "~/utils/api";
import { ArtistRow } from "../../ui/ArtistRow";
import PaginationComponent from "../../ui/PaginationComponent";
import TrackRow from "../../ui/TrackRow";
import RecapCard from "../RecapCard";

export type RecapPropsType = {
  timeRange: TimeRangeType;
};

export const itemsPerPageOptions = ["5", "10", "15", "20"];
export const totalItems = 50;

const UserTopCard = ({ timeRange = "short_term" }: RecapPropsType) => {
  const { t } = useTranslation("home");
  const [selectedType, setSelectedType] = useState<TopType>("tracks");
  const [selectedPage, setSelectedPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { data, isLoading, isError } = api.spotify_user.getTopRated.useQuery(
    {
      type: selectedType,
      timeRange: timeRange,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const { tags } = useTagsStore();

  return (
    <RecapCard key={"card-top-rated"} intent={"active"} loading={isLoading}>
      <div className="grid grid-cols-2">
        {TopTypeArray.map((type, i) => (
          <RecapCard.Header
            key={i}
            onClick={() => setSelectedType(type)}
            intent={selectedType === type ? "static" : "active"}
          >
            <p
              className={`${
                selectedType === type
                  ? "border  border-transparent border-b-base-content"
                  : ""
              } pb-2 md:text-lg`}
            >
              {t(getTranslationByType(type))}
            </p>
          </RecapCard.Header>
        ))}
      </div>
      <RecapCard.Container error={isError}>
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
        />
      </RecapCard.Container>
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
