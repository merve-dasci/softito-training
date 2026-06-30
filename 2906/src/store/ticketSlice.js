import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3001';

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/tickets`);
      if (!response.ok) {
        throw new Error('Sefer bilgileri yüklenemedi.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Bir hata oluştu.');
    }
  }
);

export const selectTicketById = createAsyncThunk(
  'tickets/selectTicketById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${id}`);
      if (!response.ok) {
        throw new Error('Sefer detayları alınamadı.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Sefer detay hatası.');
    }
  }
);

export const bookTicketSeats = createAsyncThunk(
  'tickets/bookTicketSeats',
  async ({ ticket, seatNumbers, user, totalPrice }, { rejectWithValue }) => {
    try {
      // 1. Update seat status of selected seats to 'occupied' on the ticket
      const updatedSeats = ticket.seats.map(seat => {
        if (seatNumbers.includes(seat.number)) {
          return { ...seat, status: 'occupied' };
        }
        return seat;
      });

      const updateTicketRes = await fetch(`${API_URL}/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ticket,
          seats: updatedSeats
        }),
      });

      if (!updateTicketRes.ok) {
        throw new Error('Koltuk rezervasyonu yapılamadı.');
      }

      const updatedTicket = await updateTicketRes.json();

      // 2. Create a new booking entry
      const bookingEntry = {
        userId: user ? user.id : 'anonymous',
        userName: user ? `${user.name} ${user.surname}` : 'Misafir',
        ticketId: ticket.id,
        company: ticket.company,
        type: ticket.type,
        departure: ticket.departure,
        arrival: ticket.arrival,
        date: ticket.date,
        time: ticket.time,
        seatsBooked: seatNumbers,
        pricePaid: totalPrice,
        createdAt: new Date().toISOString()
      };

      const bookingRes = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingEntry),
      });

      if (!bookingRes.ok) {
        throw new Error('Rezervasyon kaydı oluşturulamadı.');
      }

      return { ticket: updatedTicket, booking: await bookingRes.json() };
    } catch (error) {
      return rejectWithValue(error.message || 'Ödeme ve biletleme başarısız.');
    }
  }
);

export const addTicket = createAsyncThunk(
  'tickets/addTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) {
        throw new Error('Sefer eklenemedi.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Sefer eklenirken hata oluştu.');
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${ticketData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) {
        throw new Error('Sefer güncellenemedi.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Sefer güncellenirken hata oluştu.');
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Sefer silinemedi.');
      }
      return ticketId;
    } catch (error) {
      return rejectWithValue(error.message || 'Sefer silinirken hata oluştu.');
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'tickets/fetchBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const url = userId ? `${API_URL}/bookings?userId=${encodeURIComponent(userId)}` : `${API_URL}/bookings`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Bilet geçmişi yüklenemedi.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Bilet geçmişi alınırken hata oluştu.');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'tickets/cancelBooking',
  async ({ bookingId, ticketId, seatNumbers }, { rejectWithValue, dispatch }) => {
    try {
      const deleteRes = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (!deleteRes.ok) {
        throw new Error('Bilet iptal edilemedi.');
      }

      const ticketRes = await fetch(`${API_URL}/tickets/${ticketId}`);
      if (ticketRes.ok) {
        const ticket = await ticketRes.json();
        const updatedSeats = ticket.seats.map(seat => {
          if (seatNumbers.includes(seat.number)) {
            return { ...seat, status: 'available' };
          }
          return seat;
        });

        await fetch(`${API_URL}/tickets/${ticketId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...ticket,
            seats: updatedSeats
          }),
        });
      }

      dispatch(fetchTickets());
      return bookingId;
    } catch (error) {
      return rejectWithValue(error.message || 'İptal işlemi başarısız.');
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    list: [],
    loading: false,
    error: null,
    searchCriteria: {
      from: '',
      to: '',
      date: '',
      type: 'bus', // 'bus' or 'flight'
    },
    selectedTicket: null,
    lastBooking: null,
    bookings: [],
  },
  reducers: {
    setSearchCriteria: (state, action) => {
      state.searchCriteria = { ...state.searchCriteria, ...action.payload };
    },
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    clearLastBooking: (state) => {
      state.lastBooking = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Select Ticket By Id
      .addCase(selectTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTicket = action.payload;
      })
      .addCase(selectTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Book Seats
      .addCase(bookTicketSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookTicketSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTicket = action.payload.ticket;
        state.lastBooking = action.payload.booking;
        // Update list as well
        state.list = state.list.map(t => t.id === action.payload.ticket.id ? action.payload.ticket : t);
      })
      .addCase(bookTicketSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Ticket
      .addCase(addTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Ticket
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(t => t.id === action.payload.id ? action.payload : t);
        if (state.selectedTicket && state.selectedTicket.id === action.payload.id) {
          state.selectedTicket = action.payload;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Ticket
      .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(t => t.id !== action.payload);
        if (state.selectedTicket && state.selectedTicket.id === action.payload) {
          state.selectedTicket = null;
        }
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchCriteria, clearSelectedTicket, clearLastBooking } = ticketSlice.actions;
export default ticketSlice.reducer;
