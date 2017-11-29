export default function(swimmer, schools) {
  let currentSchool = schools.filter((school) => school.id === swimmer.schoolId)[0];
  if (currentSchool) {
    return currentSchool.isRanked;
  }
}
