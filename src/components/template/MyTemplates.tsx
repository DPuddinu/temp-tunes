import { type PlaylistTemplate, type TemplateEntry } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import Accordion from "../ui/Accordion";
import DropdownMenu from "../ui/DropdownMenu";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export const MyTemplates = () => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const { t: t_common } = useTranslation("common");
  const { data, isLoading } = api.template.getCurrentUserTemplates.useQuery(
    undefined,
    {
      onError(err) {
        const msg = t("get_error");
        setMessage(msg);
      },
    }
  );

  return (
    <section>
      <h2 className="text-2xl font-semibold">{t("my_templates")}</h2>
      {data &&
        data.map((template) => (
          <TemplateRow key={template.id} template={template} />
        ))}
      {isLoading && <LoadingSpinner />}
    </section>
  );
};

const TemplateRow = ({
  template,
}: {
  template: PlaylistTemplate & {
    templateEntries: TemplateEntry[];
  };
}) => {
  const { name, description, templateEntries } = template;
  const { t } = useTranslation("common");
  return (
    <Accordion>
      <Accordion.Header>
        <h2>{name}</h2>
      </Accordion.Header>
      <Accordion.Content>
        <div className="p-4">
          <div className="rounded-box bg-base-200 p-4 ">
            <div className="flex w-full items-center justify-between">
              <p className="text-sm ">{description}</p>
              <DropdownMenu intent={"dark"}>
                <DropdownMenu.Options
                  options={[
                    {
                      label: t("edit"),
                      onClick: () => false,
                      disabled: true,
                    },
                    {
                      label: t("delete"),
                      onClick: () => false,
                      disabled: true,
                    },
                    {
                      label: t("share"),
                      onClick: () => false,
                      disabled: true,
                    },
                  ]}
                />
              </DropdownMenu>
            </div>
            {templateEntries.map(({ entry, id }) => (
              <p key={id}>{entry}</p>
            ))}
          </div>
        </div>
      </Accordion.Content>
    </Accordion>
  );
};
