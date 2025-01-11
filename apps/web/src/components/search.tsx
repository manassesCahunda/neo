import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);

    const params = new URLSearchParams(window.location.search);
    params.set("query", value);
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
        className="md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}
