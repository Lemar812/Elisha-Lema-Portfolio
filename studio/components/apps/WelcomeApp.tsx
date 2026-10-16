"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, FolderOpen } from "lucide-react";
import { openStudioApp } from "@/studio/lib/navigation";
import { works } from "@/data/works";
export default function WelcomeApp() {
  return (
    <div className="ec-welcome ec-content">
      <Image
        width={240}
        height={110}
        className="ec-wordmark"
        src="/brand/Wordmark-White.svg"
        alt="Elisha Creatives"
      />
      <p className="ec-kicker">The creative desktop · Tanzania</p>
      <h1>
        Imagine.
        <br />
        Design. Develop.
        <br />
        <span>Create.</span>
      </h1>
      <p className="ec-lead">
        A place to explore the identities, designs and websites I create. I’m
        Elisha Lema—welcome to my workspace.
      </p>
      <div className="ec-actions">
        <button
          className="ec-primary"
          onClick={() => openStudioApp("projects")}
        >
          <FolderOpen size={17} /> Explore {works.length} creatives
        </button>
        <button
          className="ec-secondary"
          onClick={() => openStudioApp("contact")}
        >
          Start a project <ArrowUpRight size={17} />
        </button>
      </div>
      <div className="ec-welcome-footer">
        <button onClick={() => openStudioApp("about-me")}>
          Meet Elisha <ArrowUpRight size={15} />
        </button>
        <button onClick={() => openStudioApp("help")}>
          <Play size={14} /> Take the tour
        </button>
        <Link href="/writing">
          Studio notes <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
