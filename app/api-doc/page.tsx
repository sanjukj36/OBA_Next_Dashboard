import { ReactSwagger } from "./react-swagger";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function IndexPage() {
  return (
    <section className="container">
      <ReactSwagger />
    </section>
  );
}
