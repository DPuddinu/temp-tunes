import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Template, type TemplateEntry } from "@prisma/client";
import { Reorder } from "framer-motion";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { RectangleSkeleton } from "../ui/skeletons/RectangleSkeleton";

const TemplateFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, {
      message: "name_min_len",
    })
    .max(50, {
      message: "name_max_len",
    }),
  description: z
    .string()
    .max(150, {
      message: "desc_max_len",
    })
    .optional(),
  entries: z
    .object({
      entry: z.string().min(3),
    })
    .array()
    .min(1, {
      message: "entries_min_len",
    }),
});

export type TemplateFormType = z.infer<typeof TemplateFormSchema>;

const EntryRow = dynamic(() => import("./EntryRow"), {
  loading: () => <RectangleSkeleton />,
});

interface props {
  data?: Template & { templateEntries: TemplateEntry[] };
}
function CreateTemplate({ data }: props) {
  const { setMessage } = useToast();
  const { t: t_template } = useTranslation("templates");

  const { t } = useTranslation("common");
  const entryRef = useRef<HTMLInputElement>(null);
  const [parent] = useAutoAnimate();
  const [selectedRow, setSelectedRow] = useState<number | undefined>();
  const router = useRouter();

  const { mutate } = api.template.create.useMutation({
    onError() {
      setMessage(t("error"));
    },
    onSuccess() {
      setMessage(t_template("created", { template: "Template" }));
      router.push("/templates");
    },
  });

  const { mutate: edit } = api.template.edit.useMutation({
    onError() {
      setMessage(t("error"));
    },
    onSuccess() {
      setMessage(`Template ${t("updated")}`);
      router.push("/templates");
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TemplateFormType>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      description: data?.description ? data.description : undefined,
      name: data?.name,
      entries: data?.templateEntries,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "entries", // unique name for your Field Array
  });

  const onSubmit: SubmitHandler<TemplateFormType> = (_data) => {
    if (data?.id) {
      edit({
        new_entries: _data.entries,
        old_entries: data.templateEntries,
        id: data.id,
        name: _data.name,
        description: _data.description,
      });
    } else {
      mutate({
        name: _data.name,
        description: _data.description,
        entries: _data.entries.map((t) => t.entry),
      });
    }
  };
  return (
    <form
      className="min-h-60 flex w-full max-w-sm flex-col justify-between gap-2 rounded-xl bg-base-300 p-2 shadow sm:max-w-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col " ref={parent}>
        <div className="flex flex-col justify-between gap-2 bg-base-300">
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">{t_template("template_name")}</span>
            </label>
            <input
              type="text"
              placeholder={t("type_here", { defaultValue: "Type here..." })}
              className="input-ghost input w-full  grow bg-base-200 text-base"
              {...register("name")}
            />
            {errors?.name?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t(errors?.name?.message, { defaultValue: "error" })}
                </span>
              </label>
            )}
          </div>
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">{t_template("description")}</span>
            </label>
            <input
              type="text"
              placeholder={t("type_here", { defaultValue: "Type here..." })}
              className="input-ghost input w-full  grow bg-base-200 text-base"
              {...register("description")}
            />
            {errors?.description?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t(errors?.description?.message, {
                    defaultValue: "error",
                  })}
                </span>
              </label>
            )}
          </div>
        </div>
        {fields.length > 0 && (
          <div className="form-control w-full ">
            <label className="label pb-0">
              <span className="label-text">{t_template("entries")}</span>
            </label>
            {/* <Reorder.Group
              axis="y"
              onReorder={(entries) => console.log(entries)}
              values={fields.map((field) => field.entry)}
              ref={parent}
              className="[&>li]:py-1"
            > */}
            <>
              {fields.map((entry, i) => (
                <EntryRow
                  register={register}
                  id={entry.id}
                  index={i}
                  key={i}
                  name={entry.entry}
                  open={i === selectedRow}
                  setOpen={() =>
                    setSelectedRow((row) => (row === i ? undefined : i))
                  }
                  onDelete={() => {
                    remove(i);
                    setSelectedRow(undefined);
                  }}
                />
              ))}
            </>
            {/* </Reorder.Group> */}
          </div>
        )}
      </div>

      <div className="form-control w-full ">
        <label className="label pt-0">
          <span className="label-text">{t_template("new_entry")}</span>
        </label>
        <div className="flex gap-2">
          <div>
            <input
              ref={entryRef}
              type="text"
              placeholder={t("type_here", { defaultValue: "Type here..." })}
              className="input w-full  grow outline-none"
            />
            {errors?.entries?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t_template(errors?.entries?.message, {
                    defaultValue: "Required entries ",
                  })}
                </span>
              </label>
            )}
          </div>

          <button
            type="button"
            className="btn-circle btn bg-base-100 p-2 text-xl hover:bg-base-200"
            onClick={() => {
              if (entryRef.current !== null) {
                append({ entry: entryRef.current.value });
                entryRef.current.value = "";
              }
            }}
          >
            +
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="btn w-full bg-base-100 hover:bg-base-200"
      >
        {data ? t("update") : t("create")}
      </button>
    </form>
  );
}

export default CreateTemplate;
