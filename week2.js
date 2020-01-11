var fs = require('fs')
var text = fs.readFileSync('./IntegerArray.txt', 'utf-8')
var input_array = text.split('\r\n').map(val => Number(val))

const { count } = count_and_sort(input_array)
console.log('count: ', count)

function count_and_sort(arr) {
  if (arr.length <= 1) {
    return { count: 0, arr }
  }

  const len = arr.length
  const mid_index = Math.floor(len / 2)
  const left_subarray = arr.slice(0, mid_index)
  const right_subarray = arr.slice(mid_index)
  const { count: left_inversions_count, arr: left_half_sorted } = count_and_sort(left_subarray)
  const { count: right_inversions_count, arr: right_half_sorted } = count_and_sort(right_subarray)

  let i = 0,
    j = 0
  let split_inversions_count = 0
  let sorted = []
  while (i < left_half_sorted.length || j < right_half_sorted.length) {
    if (i === left_half_sorted.length) {
      sorted.push(right_half_sorted[j])
      j++
      continue
    }
    if (j === right_half_sorted.length) {
      sorted.push(left_half_sorted[i])
      i++
      continue
    }

    if (left_half_sorted[i] <= right_half_sorted[j]) {
      sorted.push(left_half_sorted[i])
      i++
    } else {
      sorted.push(right_half_sorted[j])
      j++
      split_inversions_count += left_half_sorted.length - i
    }
  }

  const inversions_count = left_inversions_count + right_inversions_count + split_inversions_count

  return {
    count: inversions_count,
    arr: sorted,
  }
}
