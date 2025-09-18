"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const CompanyTable = dynamic(() => import("./company_table"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function CompanyPage() {
  return <CompanyTable />;
}
