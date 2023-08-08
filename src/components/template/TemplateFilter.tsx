import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  TemplateFilterSchema,
  TemplateFiltersConst,
  type TemplateFilterSchemaType,
} from "~/types/zod-schemas";
import { SearchSVG } from "../ui/icons";

interface props {
  filter: TemplateFilterSchemaType | undefined;
  onSubmit: (data: TemplateFilterSchemaType | undefined) => void;
}
const TemplateFilter = ({ onSubmit, filter }: props) => {
  const { t } = useTranslation("templates");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFilterSchemaType>({
    defaultValues: {
      type: "name",
    },
    resolver: zodResolver(TemplateFilterSchema),
  });

  return (
    <div className=" w-full pb-4 sm:max-w-sm md:max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="join relative h-5 w-full">
          <div className="h-16">
            <input
              {...register("value")}
              type="text"
              placeholder={t("search") ?? "..."}
              className="input join-item w-full grow bg-secondary-content sm:max-w-sm "
            />
          </div>
          <select
            className="select-bordered select w-full max-w-[8rem] rounded-none"
            {...register("type")}
          >
            {TemplateFiltersConst.map((type) => (
              <option
                value={type}
                key={type}
                className="h-10 cursor-pointer select-none text-lg text-base-content hover:bg-base-100"
              >
                {type}
              </option>
            ))}
          </select>

          <div className="indicator h-16">
            <button type="submit" className="join-item btn bg-base-300">
              <SearchSVG />
            </button>
          </div>
        </div>
      </form>

      {errors.value?.message && (
        <label className="label text-error">
          <span className="label-text-alt mt-2 font-bold text-error">
            {t(errors.value?.message ?? "Not Valid")}
          </span>
        </label>
      )}
      {filter && (
        <div className="indicator mt-8" onClick={() => onSubmit(undefined)}>
          <span className="badge badge-secondary indicator-item h-4 text-xs font-bold cursor-pointer hover:scale-105 transition-transform">
            x
          </span>
          <div className="grid  place-items-center rounded-lg bg-base-300 p-4">
            {filter.type} : {filter.value}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateFilter;
