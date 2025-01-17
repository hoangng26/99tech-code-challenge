var sum_to_n_a = function(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function(n, acc = 0) {
  if (n === 0) return acc;
  return sum_to_n_b(n - 1, acc + n);
};

var sum_to_n_c = function(n) {
  return n * (n + 1) / 2;
};

console.log(sum_to_n_a(4)); // 10
console.log(sum_to_n_b(4)); // 10
console.log(sum_to_n_c(4)); // 10