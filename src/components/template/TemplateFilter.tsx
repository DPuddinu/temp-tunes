import { Listbox, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  TemplateFiltersConst,
  type TemplateFilterType,
} from "~/types/zod-schemas";
import { ArrowSVG, SearchSVG } from "../ui/icons";

const SearchFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "search_errors.short" })
    .max(18, { message: "search_errors.long" }),
});
type SearchFormSchemaType = z.infer<typeof SearchFormSchema>;

interface props {
  setSelectedFilter: (data: TemplateFilterType) => void;
  selectedFilter: TemplateFilterType;
  onSubmit: (data: SearchFormSchemaType) => void;
}
const TemplateFilter = ({
  selectedFilter,
  setSelectedFilter,
  onSubmit,
}: props) => {
  const { t } = useTranslation("templates");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormSchemaType>({
    resolver: zodResolver(SearchFormSchema),
  });

  return (
    <div className=" w-full pb-4 sm:max-w-sm md:max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="join relative h-5 w-full">
          <div className="h-16">
            <input
              {...register("name")}
              type="text"
              placeholder={t("search") ?? "..."}
              className="input join-item w-full grow bg-secondary-content sm:max-w-sm "
            />
          </div>

          <select
            value={selectedFilter}
            className="select-bordered select w-full max-w-[8rem] rounded-none"
            onChange={(e) =>
              setSelectedFilter(e.target.value as TemplateFilterType)
            }
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

      {errors.name?.message && (
        <label className="label text-error">
          <span className="label-text-alt mt-2 font-bold text-error">
            {t(errors.name?.message ?? "Not Valid")}
          </span>
        </label>
      )}
    </div>
  );
};

export default TemplateFilter;
