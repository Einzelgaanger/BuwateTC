import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/chat/AIAssistant';
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const courts = [
  { id: 1, name: 'Court 1', status: 'available' },
  { id: 2, name: 'Court 2', status: 'available' },
];

const timeSlots = [
  { time: '08:00', label: '8:00 AM', isPrime: true },
  { time: '09:00', label: '9:00 AM', isPrime: true },
  { time: '10:00', label: '10:00 AM', isPrime: true },
  { time: '11:00', label: '11:00 AM', isPrime: true },
  { time: '12:00', label: '12:00 PM', isPrime: false },
  { time: '13:00', label: '1:00 PM', isPrime: false },
  { time: '14:00', label: '2:00 PM', isPrime: false },
  { time: '15:00', label: '3:00 PM', isPrime: true },
  { time: '16:00', label: '4:00 PM', isPrime: true },
  { time: '17:00', label: '5:00 PM', isPrime: true },
  { time: '18:00', label: '6:00 PM', isPrime: false },
  { time: '19:00', label: '7:00 PM', isPrime: false },
  { time: '20:00', label: '8:00 PM', isPrime: false },
  { time: '21:00', label: '9:00 PM', isPrime: false },
];

// Mock booked slots (would come from database)
const bookedSlots = [
  { courtId: 1, date: format(new Date(), 'yyyy-MM-dd'), time: '09:00' },
  { courtId: 1, date: format(new Date(), 'yyyy-MM-dd'), time: '10:00' },
  { courtId: 2, date: format(new Date(), 'yyyy-MM-dd'), time: '15:00' },
  { courtId: 1, date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), time: '08:00' },
];

export default function BookCourt() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState(courts[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const isSlotBooked = (time: string) => {
    return bookedSlots.some(
      (slot) =>
        slot.courtId === selectedCourt.id &&
        slot.date === format(selectedDate, 'yyyy-MM-dd') &&
        slot.time === time
    );
  };

  const isSlotPast = (time: string) => {
    if (!isToday(selectedDate)) return false;
    const [hours] = time.split(':').map(Number);
    const now = new Date();
    return now.getHours() >= hours;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-display font-bold mb-2">Book a Court</h1>
            <p className="text-muted-foreground">
              Select a date, court, and time slot to make your reservation.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Calendar & Court Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Week Navigation */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-court" />
                    Select Date
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWeekStart(addDays(weekStart, -7))}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium min-w-[120px] text-center">
                      {format(weekStart, 'MMM yyyy')}
                    </span>
                    <button
                      onClick={() => setWeekStart(addDays(weekStart, 7))}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const isPast = isBefore(day, startOfDay(new Date()));
                    const isSelected = isSameDay(day, selectedDate);
                    
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => !isPast && setSelectedDate(day)}
                        disabled={isPast}
                        className={cn(
                          "p-3 rounded-xl text-center transition-all",
                          isPast && "opacity-40 cursor-not-allowed",
                          isSelected
                            ? "bg-court text-white shadow-court"
                            : "bg-muted hover:bg-court/10",
                          isToday(day) && !isSelected && "ring-2 ring-gold"
                        )}
                      >
                        <div className="text-xs font-medium mb-1">
                          {format(day, 'EEE')}
                        </div>
                        <div className="text-lg font-bold">
                          {format(day, 'd')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Court Selection */}
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-court" />
                  Select Court
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {courts.map((court) => (
                    <button
                      key={court.id}
                      onClick={() => setSelectedCourt(court)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        selectedCourt.id === court.id
                          ? "border-court bg-court/5"
                          : "border-border hover:border-court/50"
                      )}
                    >
                      <div className="font-semibold">{court.name}</div>
                      <div className="text-sm text-muted-foreground">Clay Court</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-court" />
                  Select Time
                </h3>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-court-light/50 border border-court/30" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted border border-border" />
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gold/20 border border-gold/50" />
                    <span>Prime Time</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {timeSlots.map((slot) => {
                    const booked = isSlotBooked(slot.time);
                    const past = isSlotPast(slot.time);
                    const isSelected = selectedSlot === slot.time;
                    const disabled = booked || past;

                    return (
                      <button
                        key={slot.time}
                        onClick={() => !disabled && setSelectedSlot(slot.time)}
                        disabled={disabled}
                        className={cn(
                          "p-3 rounded-lg border transition-all text-center",
                          disabled && "time-slot-booked",
                          !disabled && !isSelected && "time-slot-available",
                          isSelected && "time-slot-selected",
                          slot.isPrime && !disabled && !isSelected && "bg-gold/10 border-gold/30"
                        )}
                      >
                        <div className="text-sm font-medium">{slot.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h3 className="font-display font-semibold text-lg mb-6">
                  Booking Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {format(selectedDate, 'EEEE, MMM d')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Court</span>
                    <span className="font-medium">{selectedCourt.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium">
                      {selectedSlot
                        ? timeSlots.find((s) => s.time === selectedSlot)?.label
                        : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">1 Hour</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-court">
                      UGX 10,000 - 15,000
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Price varies by membership status
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="court"
                    className="w-full"
                    size="lg"
                    disabled={!selectedSlot}
                    asChild
                  >
                    <Link to="/auth">
                      Sign in to Book
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    You need to sign in to complete your booking
                  </p>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 rounded-lg bg-gold/10 border border-gold/20">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-gold-dark mb-1">
                        Booking Policy
                      </p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Book 24 hours in advance</li>
                        <li>• Cancel 2 hours before</li>
                        <li>• Pay via MoMo only</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}
