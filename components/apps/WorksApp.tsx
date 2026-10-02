"use client";
import { works } from "@/data/works";
import { featuredWorkIds } from "@/data/projectStories";
import { IndexDetailList } from "@/components/shared/IndexDetailList";
import { WorkDetail } from "@/components/shared/WorkDetail";
import { useWindowStore } from "@/lib/windowStore";
export function WorksApp() {
  const { selectedWork, workCategory, selectWork } = useWindowStore();
  return <IndexDetailList items={works} getId={w => w.id} getTitle={w => w.title} getSubtitle={w => w.category}
    matchesCategory={(w, category) => category === "Featured" ? featuredWorkIds.includes(w.id) : w.category === category}
    categories={["Featured", "Logo", "Poster/Banner", "Website"]} getCategory={w => w.category}
    selectedId={selectedWork} category={workCategory}
    onSelect={id => selectWork(id)} onCategory={category => selectWork(null, category)}
    renderDetail={work => <WorkDetail work={work} />} />;
}
