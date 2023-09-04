import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { SearchTypeConst, SearchTypeEnum } from "~/types/zod-schemas";
import { SearchSVG } from "../ui/icons";

interface props {
  onSubmit: SubmitHandler<SearchFormSchemaType>;
}

const SearchFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "search_errors.short" })
    .max(18, { message: "search_errors.long" }),
  filterType: SearchTypeEnum,
});
export type SearchFormSchemaType = z.infer<typeof SearchFormSchema>;

const SearchForm = ({ onSubmit }: props) => {
  const { t } = useTranslation("search");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormSchemaType>({
    resolver: zodResolver(SearchFormSchema),
  });

  return (
    <div className=" w-full pb-4 sm:max-w-sm md:max-w-md flex justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="join relative h-5 w-full">
          <div className="h-16">
            <input
              {...register("name")}
              type="text"
              placeholder={t("search", {
                defaultValue: "Search...",
              })}
              className="input join-item w-full grow bg-secondary-content text-black font-semibold sm:max-w-sm "
            />
          </div>

          <select
            {...register("filterType")}
            className="select-bordered select w-full max-w-[8rem] rounded-none"
          >
            {SearchTypeConst.map((type) => (
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
            {t(errors.name?.message, {
              defaultValue: "Name too long or too small",
            })}
          </span>
        </label>
      )}
    </div>
  );
};

export default SearchForm;
