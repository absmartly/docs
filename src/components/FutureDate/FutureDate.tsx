import React, { FC } from "react";

interface FutureDateProps {
  daysAhead: number;
}

export const FutureDate: FC<FutureDateProps> = ({ daysAhead }) => {
  const today = new Date();

  const tomorrow = today.setDate(today.getDate() + daysAhead);

  const dateString = new Date(tomorrow).toLocaleDateString();

  return <>{dateString}</>;
};
