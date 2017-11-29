export default function(swimmer, raceId, competitionId) {
  let timeObj = swimmer.times.filter(
    (n) => n.raceId === raceId && n.competitionId == competitionId
  );
  if (timeObj.length > 0) {
    return Number(timeObj[0].points);
  }
  return 0;
}
