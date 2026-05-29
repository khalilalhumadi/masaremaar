import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/content";

// "/" → default locale. Works in dev (server redirect) and in the static
// export (Next emits a client-side redirect to /en/).
export default function RootIndex() {
  redirect(`/${DEFAULT_LOCALE}`);
}
