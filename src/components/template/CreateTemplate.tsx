import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Template, type TemplateEntry } from "@prisma/client";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import resources from "~/@types/resources";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { ArrowDownSVG, ArrowUpSVG, DeleteSVG } from "../ui/icons";
const commonResources = resources.common;
const templateResources = resources.templates;

const TemplateFormSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, {
      message: commonResources.name_min_len,
    })
    .max(50, {
      message: commonResources.name_max_len,
    }),
  description: z
    .string()
    .max(150, {
      message: templateResources.desc_max_len,
    })
    .optional(),
  entries: z
    .object({
      entry: z.string().min(3),
    })
    .array()
    .min(1, {
      message: templateResources.entries_min_len,
    }),
});
export type TemplateFormType = z.infer<typeof TemplateFormSchema>;

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
  const utils = api.useContext().template.getByCurrentUser;

  const { mutate } = api.template.create.useMutation({
    onError() {
      setMessage(t("error"));
    },
    async onSuccess() {
      utils.invalidate();
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
    formState: { errors },
  } = useForm<TemplateFormType>({
    resolver: zodResolver(TemplateFormSchema),
    defaultValues: {
      description: data?.description ? data.description : undefined,
      name: data?.name,
      entries: data?.templateEntries,
    },
  });

  const { fields, append, remove, move } = useFieldArray({
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
            <ul ref={parent} className="[&>li]:py-1">
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
                  onMoveUp={() => {
                    if (i - 1 >= 0) {
                      move(i, i - 1);
                      setSelectedRow(i - 1);
                    }
                  }}
                  onMoveDown={() => {
                    if (i + 1 <= fields.length - 1) {
                      move(i, i + 1);
                      setSelectedRow(i + 1);
                    }
                  }}
                  onDelete={() => {
                    remove(i);
                    setSelectedRow(undefined);
                  }}
                />
              ))}
            </ul>
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
                    defaultValue: "error",
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

interface EntryRow {
  name: string;
  open: boolean;
  register: UseFormRegister<TemplateFormType>;
  id: string;
  index: number;
  setOpen: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}
const EntryRow = ({
  name,
  open,
  setOpen,
  onDelete,
  onMoveUp,
  onMoveDown,
  index,
  id,
  register,
}: EntryRow) => {
  return (
    <li key={id} className="flex items-center gap-2">
      <input
        className="btn grow bg-base-100 outline-none hover:bg-base-200"
        onClick={setOpen}
        type="text"
        defaultValue={name}
        placeholder={"name"}
        {...register(`entries.${index}.entry`)}
      />

      <Transition
        show={open}
        enter=" transition-transform duration-75"
        enterFrom="w-0 hidden"
        enterTo="w-auto block"
        leave="transition-transform duration-150"
        leaveFrom="w-auto block"
        leaveTo="w-0 hidden"
      >
        <div className="h-100 rounded-box relative flex gap-2 p-2">
          <span className="hover:cursor-pointer" onClick={onDelete}>
            <DeleteSVG />
          </span>
          <span className="hover:cursor-pointer" onClick={onMoveUp}>
            <ArrowUpSVG />
          </span>
          <span className="hover:cursor-pointer" onClick={onMoveDown}>
            <ArrowDownSVG />
          </span>
        </div>
      </Transition>
    </li>
  );
};

export default CreateTemplate;
