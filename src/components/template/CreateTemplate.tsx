import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
  useFieldArray,
  useForm,
  type SubmitHandler,
  type UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useToast } from "~/hooks/use-toast";
import { TemplateEntrySchema } from "~/types/zod-schemas";
import { api } from "~/utils/api";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ArrowDownSVG, ArrowUpSVG, DeleteSVG } from "../ui/icons";

const TemplateFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3).max(16),
  description: z.string().max(150).optional(),
  entries: TemplateEntrySchema.array().min(1),
});
type TemplateFormType = z.infer<typeof TemplateFormSchema>;

interface props {
  data?: TemplateFormType;
}
function CreateTemplate({ data }: props) {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const entryRef = useRef<HTMLInputElement>(null);
  const [parent] = useAutoAnimate();
  const [selectedRow, setSelectedRow] = useState<number | undefined>();

  const { mutate, isLoading } = api.template.createTemplate.useMutation({
    onError() {
      const msg = t("error");
      setMessage(msg);
    },
    onSuccess() {
      const msg = t("created");
      setMessage(msg);
    },
  });

  const { mutate: edit, isLoading: isEditLoading } =
    api.template.editTemplate.useMutation({
      onError() {
        const msg = t("error");
        setMessage(msg);
      },
      onSuccess() {
        const msg = t("updated");
        setMessage(msg);
      },
    });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = useForm<TemplateFormType>({ resolver: zodResolver(TemplateFormSchema) });

  useEffect(() => {
    if (data) {
      if (data.description) setValue("description", data.description);
      if (data.entries) setValue("entries", data.entries);
      if (data.name) setValue("name", data.name);
    }
  }, [data, setValue]);

  const { fields, append, remove, move } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "entries", // unique name for your Field Array
  });

  const onSubmit: SubmitHandler<TemplateFormType> = (_data) => {
    if (data?.id) {
      edit({
        new_entries: _data.entries,
        old_entries: data.entries,
        id: data.id,
        name: _data.name,
        description: _data.description,
      });
    } else {
      mutate({
        name: _data.name,
        description: _data.description,
        entries: _data.entries,
      });
    }
  };

  return (
    <form
      className="min-h-60 flex max-w-sm flex-col justify-between gap-2 rounded-xl bg-base-300 p-2 shadow"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-2" ref={parent}>
        <div className="flex justify-between gap-2 bg-base-300">
          <div>
            <input
              type="text"
              placeholder="Template Name"
              className="input-ghost input mb-2 w-full max-w-xs grow bg-base-200 text-xl"
              {...register("name")}
            />
            <input
              type="text"
              placeholder="Description"
              className="input-ghost input w-full max-w-xs grow bg-base-200 text-base"
              {...register("description")}
            />
          </div>
          {isLoading && <LoadingSpinner />}
        </div>
        <ul ref={parent} className="[&>li]:py-1">
          {fields.map((entry, i) => (
            <TemplateRow
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

      <div className="flex gap-2">
        <input
          ref={entryRef}
          type="text"
          placeholder="Template Entry"
          className="input w-full max-w-xs grow"
        />
        <button
          type="button"
          className="btn-circle btn bg-base-100 p-2 text-xl hover:bg-base-200"
          onClick={() => {
            if (entryRef.current !== null) {
              append({ entry: entryRef.current.value });
            }
          }}
        >
          +
        </button>
      </div>
      <button
        type="submit"
        disabled={!isValid}
        className="btn w-full bg-base-100 hover:bg-base-200"
      >
        Confirm
      </button>
    </form>
  );
}

interface TemplateRowProps {
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
const TemplateRow = ({
  name,
  open,
  setOpen,
  onDelete,
  onMoveUp,
  onMoveDown,
  index,
  id,
  register,
}: TemplateRowProps) => {
  return (
    <li key={id} className="flex items-center gap-2">
      <input
        className="btn grow bg-base-100 hover:bg-base-200"
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
