"use client";

import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/page-loader";

const UserTable = dynamic(() => import("./user_table"), {
  loading: () => <PageLoader />,
  ssr: false
});

export default function UserPage() {
  return <UserTable />;
}
