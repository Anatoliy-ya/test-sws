import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EntityState {
  eID: number | null;
}

const initialState: EntityState = {
  eID: null,
};

const eidSlice = createSlice({
  name: 'entity',
  initialState,
  reducers: {
    setEID: (state, action: PayloadAction<number>) => {
      state.eID = action.payload;
    },
  },
});

export const { setEID } = eidSlice.actions;
export default eidSlice.reducer;
