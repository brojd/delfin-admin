export default function(sex, style, age) {
  if (age.value == 'W1' && sex.value == 'P1' && style.value == 'S1') {
    return 1;
  } else if (age.value == 'W1' && sex.value == 'P1' && style.value == 'S2') {
    return 2;
  } else if (age.value == 'W1' && sex.value == 'P1' && style.value == 'S3') {
    return 3;
  } else if (age.value == 'W1' && sex.value == 'P2' && style.value == 'S1') {
    return 4;
  } else if (age.value == 'W1' && sex.value == 'P2' && style.value == 'S2') {
    return 5;
  } else if (age.value == 'W1' && sex.value == 'P2' && style.value == 'S3') {
    return 6;
  } else if (age.value == 'W2' && sex.value == 'P1' && style.value == 'S1') {
    return 7;
  } else if (age.value == 'W2' && sex.value == 'P1' && style.value == 'S2') {
    return 8;
  } else if (age.value == 'W2' && sex.value == 'P1' && style.value == 'S3') {
    return 9;
  } else if (age.value == 'W2' && sex.value == 'P2' && style.value == 'S1') {
    return 10;
  } else if (age.value == 'W2' && sex.value == 'P2' && style.value == 'S2') {
    return 11;
  } else if (age.value == 'W2' && sex.value == 'P2' && style.value == 'S3') {
    return 12;
  } else if (age.value == 'W3' && sex.value == 'P1' && style.value == 'S1') {
    return 13;
  } else if (age.value == 'W3' && sex.value == 'P1' && style.value == 'S2') {
    return 14;
  } else if (age.value == 'W3' && sex.value == 'P1' && style.value == 'S3') {
    return 15;
  } else if (age.value == 'W3' && sex.value == 'P2' && style.value == 'S1') {
    return 16;
  } else if (age.value == 'W3' && sex.value == 'P2' && style.value == 'S2') {
    return 17;
  } else if (age.value == 'W3' && sex.value == 'P2' && style.value == 'S3') {
    return 18;
  }
}
