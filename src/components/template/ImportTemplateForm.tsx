import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '~/hooks/use-toast';
import { api } from '~/utils/api';

const FormSchema = z.object({
  id: z.string().nullable(),
});
type FormSchemaType = z.infer<typeof FormSchema>;


interface props {
  id?: string | null | undefined;
}
const ImportTemplateForm = ({ id }: props) => {
  const { setMessage } = useToast();
  const { t } = useTranslation("templates");
  const { t: t_common } = useTranslation("common");

  const router = useRouter();
  const utils = api.useContext().template.getByCurrentUser;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: id,
    },
  });

  const { mutate } = api.template.importById.useMutation({
    onError() {
      setMessage(t("error"));
    },
    async onSuccess() {
      setMessage(t("import_success"));
      utils.invalidate();
      router.push("/templates");
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = ({ id }) => {
    mutate({
      id: Number(id),
    });
  };

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
        <div className="join w-full ">
          <div className="form-control w-full max-w-xs">
            <input
              className="input-bordered join-item input grow bg-white "
              placeholder={t("import_placeholder", {
                defaultValue: "Paste template id...",
              })}
              {...register("id")}
            />

            {errors?.id?.message && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {t("char_len")}
                </span>
              </label>
            )}
          </div>
          <div className="indicator">
            <button type="submit" className="join-item btn">
              {t_common("import")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


export default ImportTemplateForm