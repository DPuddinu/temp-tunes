import { Listbox, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { TemplateFiltersConst, type TemplateFilterType } from "~/types/zod-schemas";
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
const TemplateFilter = ({selectedFilter, setSelectedFilter, onSubmit}: props) => {
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

          <Listbox value={selectedFilter} onChange={setSelectedFilter}>
            <div className="join-item relative ">
              <Listbox.Button className=" h-12 w-20 cursor-pointer justify-between bg-base-300 p-2 text-left focus:outline-none sm:text-sm">
                <div className="flex items-center justify-between">
                  <span>{selectedFilter}</span>
                  <ArrowSVG />
                </div>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-300 p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {TemplateFiltersConst.map((type) => (
                    <Listbox.Option
                      value={type}
                      key={type}
                      className="relative cursor-pointer select-none rounded-lg py-2 pl-2 pr-4 hover:bg-base-100"
                    >
                      {type}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
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
