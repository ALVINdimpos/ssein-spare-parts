import React from "react";
import { StatisticsCard } from "../../widgets/cards";
import Tables from "./tables";
import { statisticsCardsData } from "../../data";

export function Home() {
  return (
    <div className="mt-12">
      <div className="grid mb-12 gap-y-10 gap-x-8 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white ",
            })}
          />
        ))}
      </div>
      <Tables />
    </div>
  );
}

export default Home;
