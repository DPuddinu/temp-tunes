import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import MainLayout from "~/components/layouts/MainLayout";
import TemplateLayout from "~/components/layouts/TemplateLayout";
import CreatePlaylistForm from "~/components/template/CreatePlaylistForm";
import CreatePlaylistSkeleton from "~/components/ui/skeletons/CreatePlaylistSkeleton";
import { useToast } from "~/hooks/use-toast";
import { type PageWithLayout } from "~/types/page-types";
import { type Track } from "~/types/spotify-types";
import { api } from "~/utils/api";
import { getPageProps } from "~/utils/helpers";

type SubmitDataType = {
  [k: string]: Track;
};

const CreatePlaylistFromTemplate: PageWithLayout = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { t } = useTranslation("templates");
  const { t: t_common } = useTranslation("common");

  const { setMessage } = useToast();
  const [page, setPage] = useState(0);
  const [disabledSearch, setDisabledSearch] = useState(false);
  const [submitTracks, setSubmitTracks] = useState<SubmitDataType>({});

  // prettier-ignore
  const { isLoading, data: templateData } = api.template.getById.useQuery(
    { id: Number(id) ?? -1 },
    {
      queryKey: ["template.getById", { id: Number(id) ?? -1 }],
      onError() {
        const msg = t("get_error");
        setMessage(msg);
      },
      enabled: id !== undefined,
    }
  );

  const template = useMemo(
    () => templateData?.templateEntries[page],
    [templateData, page]
  );

  const { mutate } = api.spotify_playlist.createPlaylist.useMutation({
    onSuccess() {
      setMessage(t_common("created_playlist"));
    },
    onError() {
      setMessage(t_common("error"));
    },
  });

  const savedValue = useMemo(() => {
    const currentEntry = templateData?.templateEntries[page];
    if (currentEntry) {
      const value = submitTracks[currentEntry.id];
      if (value)
        return `${value.name} - ${value.artists.map((a) => a.name).join(", ")}`;
    }
    return "";
  }, [page, templateData, submitTracks]);

  return (
    <>
      {isLoading && <CreatePlaylistSkeleton />}
      {templateData && (
        <section className="flex flex-col items-center gap-2">
          <h1 className="p-2 text-2xl font-bold sm:text-4xl">
            {templateData?.name}
          </h1>
          <div className="w-full max-w-sm rounded-lg bg-base-300 p-2 pb-4 shadow">
            <ul className="steps steps-horizontal w-full">
              {template && (
                <li
                  data-content={page + 1}
                  key={template.entry}
                  className="step-primary step w-full"
                >
                  {template.entry}
                </li>
              )}
            </ul>
            <CreatePlaylistForm
              initialValue={savedValue}
              disabled={disabledSearch}
              onSelected={(track) => {
                setSubmitTracks((uris) => {
                  const temp = { ...uris };
                  if (template) {
                    temp[template.id] = track;
                  }
                  return temp;
                });
              }}
            />
            <div className="mt-4 flex w-full justify-center gap-2">
              <button
                disabled={page === 0}
                className="btn-square join-item btn w-24 border-none hover:bg-base-100 disabled:bg-base-100 disabled:bg-opacity-50"
                onClick={() => {
                  setPage((page) => page - 1);
                  setDisabledSearch(true);
                }}
              >
                {t_common("previous")}
              </button>
              <button
                disabled={page === templateData?.templateEntries.length - 1}
                className="btn-square join-item btn w-24 border-none hover:bg-base-100 disabled:bg-base-100 disabled:bg-opacity-50"
                onClick={() => {
                  setPage((page) => page + 1);
                  setDisabledSearch(true);
                }}
              >
                {t_common("next")}
              </button>
            </div>
          </div>
          <div className="mt-2 flex w-full max-w-sm justify-center gap-2">
            <Link
              href={"/templates"}
              className="btn w-32 border-none bg-red-500 text-black hover:bg-red-400"
            >
              {t_common("cancel")}
            </Link>

            <button
              disabled={Object.values(submitTracks).length === 0}
              className="btn w-32 border-none bg-green-500 text-black hover:bg-green-400"
              onClick={() => {
                mutate({
                  name: templateData.name,
                  uris: Object.values(submitTracks).map((t) => t.uri),
                });
              }}
            >
              {t_common("create")}
            </button>
          </div>
        </section>
      )}
    </>
  );
};

CreatePlaylistFromTemplate.getLayout = (page) => (
  <MainLayout>
    <TemplateLayout>{page}</TemplateLayout>
  </MainLayout>
);
export default CreatePlaylistFromTemplate;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getPageProps(["templates", "common"], context);
};
