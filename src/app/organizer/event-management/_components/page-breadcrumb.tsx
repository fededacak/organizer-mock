import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  segments: BreadcrumbSegment[];
  action?: {
    label: string;
    href: string;
    external?: boolean;
  };
}

export function PageBreadcrumb({ segments, action }: PageBreadcrumbProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-0.5 text-sm">
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return (
            <span key={i} className="flex items-center gap-0.5 font-semibold">
              {i > 0 && (
                <span className="text-gray">
                  <ChevronRight className="size-3.5" strokeWidth={2.5} />
                </span>
              )}
              {segment.href && !isLast ? (
                <Link
                  href={segment.href}
                  className="text-gray transition-colors duration-200 ease hover:text-black"
                >
                  {segment.label}
                </Link>
              ) : (
                <span className="font-semibold text-black">
                  {segment.label}
                </span>
              )}
            </span>
          );
        })}
      </div>
      {action && (
        <Link
          href={action.href}
          {...(action.external && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
          className="flex items-center gap-1.5 text-sm font-bold text-tp-blue transition-opacity duration-200 ease hover:opacity-75"
        >
          {action.label}
          <ExternalLink className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
