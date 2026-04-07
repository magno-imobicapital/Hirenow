import Image from "next/image";
import Link from "next/link";

type ActionButton =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never };

type PageHeaderProps = {
  pageName: string;
  pageTitle: string;
  pageDescription: string;
  actionButton?: ActionButton;
};

export default function PageHeader({
  pageName,
  pageTitle,
  pageDescription,
  actionButton,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-10 bg-background max-w-[1500px] px-12 pt-10 pb-12 lg:px-16 lg:pt-12 mx-auto">
      <Image
        src="/images/logo.png"
        alt="hireme"
        width={110}
        height={28}
        priority
      />

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {pageName}
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-secondary-dark sm:text-5xl">
            {pageTitle}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            {pageDescription}
          </p>
        </div>

        {actionButton ? (
          actionButton.href ? (
            <Link
              href={actionButton.href}
              className="shrink-0 self-start sm:self-end inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              {actionButton.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="shrink-0 self-start sm:self-end inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
            >
              {actionButton.label}
            </button>
          )
        ) : null}
      </div>
    </header>
  );
}
