import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/site/index.html"
      title="Conecta VTX — Preview"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
      }}
    />
  );
}
