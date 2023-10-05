"use client";
import { useState, useEffect } from "react";

import dynamic from "next/dynamic";

const Example = dynamic(() => import("./../Components/example"), {
  ssr: false,
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(true);
    }
  }, []);

  return <>{loading ? <Example /> : "Loading..."}</>;
}
