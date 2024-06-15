// src/redux/DefectsSlice.js
const initialState = {
  defects: [],
}

const defectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DEFECTS':
      return {
        ...state,
        defects: action.payload,
      }
    default:
      return state
  }
}

export const setDefects = (defects) => ({
  type: 'SET_DEFECTS',
  payload: defects,
})

// Selector function to filter defects by screen_no
export const selectDefectsByScreenNo = (state, screenNo) => {
  if (!screenNo) {
    return state.defects.defects
  }
  return state.defects.defects.filter(defect => defect.screen_no == screenNo);
};

export default defectsReducer
