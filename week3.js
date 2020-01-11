// Answer #1: 162085
// Answer #2: 164123
// Answer #3: 138382

var fs = require('fs')
var text = fs.readFileSync('./QuickSort.txt', 'utf-8')
var input_array = text.split('\r\n').map(val => Number(val))

let comparisons_count = 0

Quicksort(input_array)
console.log('array: ', input_array)
console.log('comparisons: ', comparisons_count)

function Quicksort(arr) {
  QuicksortSubarray(arr, { left: 0, right: arr.length - 1 })
}

function QuicksortSubarray(arr, indices) {
  const { left, right } = indices
  const len = right - left + 1
  if (len <= 1) return

  let pivot_index = SelectPivot(arr, indices)
  pivot_index = PartitionAndReturnPivotIndex(arr, { left, right, pivot: pivot_index })
  const left_subarr_indices = { left, right: pivot_index - 1 }
  const right_subarr_indices = { left: pivot_index + 1, right }
  QuicksortSubarray(arr, left_subarr_indices)
  QuicksortSubarray(arr, right_subarr_indices)
}

function PartitionAndReturnPivotIndex(arr, indices) {
  const { left, right, pivot: pivot_index } = indices
  const pivot_value = arr[pivot_index]
  const length = right - left + 1

  // pivot gets compared with all other elements
  comparisons_count += length - 1

  Swap(arr, left, pivot_index)

  let i = left + 1
  for (j = left + 1; j <= right; j++) {
    if (arr[j] < pivot_value) {
      Swap(arr, i, j)
      i++
    }
  }

  // put pivot in place
  Swap(arr, left, i - 1)
  return i - 1
}

function SelectPivot(arr, indices) {
  const { left, right } = indices

  indices.middle = Math.floor((left + right) / 2)

  const left_val = arr[indices.left]
  const right_val = arr[indices.right]
  const middle_val = arr[indices.middle]
  const max_val = Math.max(left_val, right_val, middle_val)
  const min_val = Math.min(left_val, right_val, middle_val)

  if (left_val !== max_val && left_val !== min_val) return indices.left
  if (right_val !== max_val && right_val !== min_val) return indices.right
  if (middle_val !== max_val && middle_val !== min_val) return indices.middle
}

function Swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
