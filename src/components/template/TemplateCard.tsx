import { cn } from "~/utils/utils";

interface cardAction {
  label: string;
  onClick: () => void;
  disabled: boolean;
}

interface TemplateCardProps {
  color: string;
  title: string;
  description: string;
  actions: cardAction[];
  isNew?: boolean;
}

// prettier-ignore
const TemplateCard = ({actions, color, description, title, isNew = false}: TemplateCardProps) => {
  return (
    <div className="card-compact card max-w-md bg-base-300 shadow-xl">
      <figure className={cn("h-10", color)}>
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {title}
          {isNew && <div className="badge badge-secondary">NEW</div>}
        </h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          {actions.map((action) => (
            <button
              key={action.label}
              className={cn("btn text-black", color)}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateCard;
