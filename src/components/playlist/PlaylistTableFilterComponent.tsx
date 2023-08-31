import { type Table } from "@tanstack/react-table";
import { useTranslation } from "next-i18next";
import AccordionComponent from "../ui/Accordion";

function FiltersComponent<TData>({ table }: { table: Table<TData> }) {
  const { t } = useTranslation("common");
  return (
    <AccordionComponent title={t("filter")}>
      <div className="flex flex-wrap gap-2 rounded-b-lg bg-base-200 p-4 md:flex-nowrap">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">{t("name")}</span>
          </label>
          <input
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            type="text"
            placeholder=""
            className="input-bordered input w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">{t("creator")}</span>
          </label>
          <input
            value={
              (table.getColumn("creator")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn("creator")?.setFilterValue(event.target.value);
            }}
            type="text"
            placeholder=""
            className="input-bordered input w-full max-w-xs"
          />
        </div>
      </div>
    </AccordionComponent>
  );
}
export default FiltersComponent;
