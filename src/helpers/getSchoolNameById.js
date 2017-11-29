export default function(schools, schoolId) {
  if (schools.length > 0) {
    return schools.filter((n) => n.id === schoolId)[0].name;
  }
}
