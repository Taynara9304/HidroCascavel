// componentes/DateTimePickerCompleto.js - VERSÃO CORRIGIDA
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

const DateTimePickerCompleto = ({ 
  value, 
  onChange, 
  placeholder = "Selecione data e hora",
  minDate = new Date()
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState(value || new Date());
  const [selectedTime, setSelectedTime] = useState(
    value ? 
    `${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}` 
    : '08:00'
  );
  const [customTime, setCustomTime] = useState('');

  console.log('🎯 DateTimePicker - Estado:', {
    modalVisible,
    selectedDate: selectedDate?.toISOString(),
    selectedTime,
    value: value?.toISOString()
  });

  // Nomes dos meses em português
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Horários disponíveis
  const horariosDisponiveis = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // ✅ CORREÇÃO: Gerar calendário de forma segura
  const generateCalendar = () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      
      const weeks = [];
      let day = 1;
      
      for (let i = 0; i < 6; i++) {
        const week = [];
        
        for (let j = 0; j < 7; j++) {
          if ((i === 0 && j < firstDayOfWeek) || day > daysInMonth) {
            week.push(null);
          } else {
            week.push(day);
            day++;
          }
        }
        
        weeks.push(week);
        if (day > daysInMonth) break;
      }
      
      return weeks;
    } catch (error) {
      console.error('❌ Erro ao gerar calendário:', error);
      return [[]];
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear() &&
      day === today.getDate()
    );
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    return (
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear() &&
      day === selectedDate.getDate()
    );
  };

  const isDisabled = (day) => {
    if (!day) return true;
    
    const testDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    // Desabilitar datas passadas
    return testDate < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const handleDayPress = (day) => {
    console.log('📅 Dia pressionado:', day);
    if (day && !isDisabled(day)) {
      const newSelectedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      setSelectedDate(newSelectedDate);
      console.log('✅ Nova data selecionada:', newSelectedDate.toISOString());
    }
  };

  const handleTimeSelect = (time) => {
    console.log('⏰ Horário selecionado:', time);
    setSelectedTime(time);
    setCustomTime(''); // Limpar horário personalizado quando selecionar um pré-definido
  };

  const handleCustomTimeChange = (text) => {
    console.log('⌨️ Horário personalizado:', text);
    setCustomTime(text);
    
    // Validar formato HH:MM e atualizar selectedTime se for válido
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (timeRegex.test(text)) {
      setSelectedTime(text);
    }
  };

  const handleConfirm = () => {
    console.log('✅ Confirmando data/hora...');
    
    try {
      // Usar horário personalizado se estiver preenchido e válido, senão usar selectedTime
      const finalTime = customTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(customTime) 
        ? customTime 
        : selectedTime;
      
      // Combinar data selecionada com horário
      const [hours, minutes] = finalTime.split(':').map(Number);
      const finalDateTime = new Date(selectedDate);
      finalDateTime.setHours(hours, minutes, 0, 0);
      
      console.log('🕐 DateTime final:', {
        finalDateTime: finalDateTime.toISOString(),
        local: finalDateTime.toLocaleString('pt-BR'),
        horarioUsado: finalTime
      });
      
      // ✅ CORREÇÃO: Chamar onChange antes de fechar o modal
      if (onChange) {
        onChange(finalDateTime);
      }
      
      setModalVisible(false);
      console.log('✅ Modal fechado após confirmação');
    } catch (error) {
      console.error('❌ Erro ao confirmar data/hora:', error);
    }
  };

  const handleCancel = () => {
    console.log('❌ Cancelando seleção...');
    setModalVisible(false);
  };

  const formatDisplay = (date) => {
    if (!date) return '';
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calendarWeeks = generateCalendar();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.dateTimeButton} 
        onPress={() => {
          console.log('📅 Abrindo modal...');
          setModalVisible(true);
        }}
      >
        <Text style={value ? styles.dateTimeText : styles.placeholder}>
          {value ? formatDisplay(value) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Data e Hora</Text>

            {/* Calendário - CORRIGIDO: ScrollView com altura fixa */}
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Seção do Calendário */}
              <View style={styles.calendarSection}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity 
                    onPress={() => navigateMonth('prev')} 
                    style={styles.navButton}
                  >
                    <Text style={styles.navText}>‹</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.monthText}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </Text>
                  
                  <TouchableOpacity 
                    onPress={() => navigateMonth('next')} 
                    style={styles.navButton}
                  >
                    <Text style={styles.navText}>›</Text>
                  </TouchableOpacity>
                </View>

                {/* Dias da semana */}
                <View style={styles.weekDays}>
                  {weekDays.map((day, index) => (
                    <Text key={index} style={styles.weekDayText}>
                      {day}
                    </Text>
                  ))}
                </View>

                {/* Dias do mês */}
                <View style={styles.calendarContainer}>
                  {calendarWeeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.week}>
                      {week.map((day, dayIndex) => (
                        <TouchableOpacity
                          key={dayIndex}
                          style={[
                            styles.day,
                            isToday(day) && styles.today,
                            isSelected(day) && styles.selectedDay,
                            isDisabled(day) && styles.disabledDay
                          ]}
                          onPress={() => handleDayPress(day)}
                          disabled={!day || isDisabled(day)}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              !day && styles.emptyDay,
                              isToday(day) && styles.todayText,
                              isSelected(day) && styles.selectedDayText,
                              isDisabled(day) && styles.disabledDayText
                            ]}
                          >
                            {day || ''}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              </View>

              {/* Seletor de Horário */}
              <View style={styles.timeSection}>
                <Text style={styles.timeSectionTitle}>Selecione o Horário</Text>
                
                {/* Horários pré-definidos */}
                <Text style={styles.timeSubtitle}>Horários disponíveis:</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.timeScroll}
                  contentContainerStyle={styles.timeScrollContent}
                >
                  {horariosDisponiveis.map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeButton,
                        selectedTime === time && styles.selectedTimeButton
                      ]}
                      onPress={() => handleTimeSelect(time)}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        selectedTime === time && styles.selectedTimeButtonText
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Horário personalizado - CORRIGIDO: Agora é editável */}
                <View style={styles.customTimeContainer}>
                  <Text style={styles.customTimeLabel}>Ou digite um horário personalizado:</Text>
                  <View style={styles.customTimeInputContainer}>
                    <TextInput
                      style={styles.customTimeInput}
                      value={customTime}
                      onChangeText={handleCustomTimeChange}
                      placeholder="HH:MM (ex: 14:30)"
                      placeholderTextColor="#999"
                      maxLength={5}
                      keyboardType="numbers-and-punctuation"
                      editable={true}
                      selectTextOnFocus={true}
                    />
                    <Text style={styles.customTimeExample}>Ex: 09:30, 14:45, 16:20</Text>
                  </View>
                </View>
              </View>

              {/* Data e Hora Selecionadas */}
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedLabel}>Data e Hora Selecionadas:</Text>
                <Text style={styles.selectedDateTime}>
                  {selectedDate.toLocaleDateString('pt-BR')} às {selectedTime}
                  {customTime && customTime !== selectedTime && ` (personalizado: ${customTime})`}
                </Text>
              </View>
            </ScrollView>

            {/* ✅ CORREÇÃO: Botões de Ação FIXOS fora do ScrollView */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
    minHeight: 50,
    justifyContent: 'center',
  },
  dateTimeText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.8,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    paddingBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  calendarSection: {
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 10,
    minWidth: 44,
    alignItems: 'center',
  },
  navText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2685BF',
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  weekDayText: {
    fontWeight: 'bold',
    color: '#666',
    width: 32,
    textAlign: 'center',
    fontSize: 12,
  },
  calendarContainer: {
    minHeight: 160,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  day: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    margin: 2,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  emptyDay: {
    color: 'transparent',
  },
  today: {
    backgroundColor: '#2685BF20',
    borderWidth: 1,
    borderColor: '#2685BF',
  },
  todayText: {
    color: '#2685BF',
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: '#2685BF',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledDay: {
    backgroundColor: '#f5f5f5',
  },
  disabledDayText: {
    color: '#ccc',
  },
  timeSection: {
    marginBottom: 20,
  },
  timeSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  timeSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeScroll: {
    marginBottom: 16,
  },
  timeScrollContent: {
    paddingRight: 20,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 70,
    alignItems: 'center',
  },
  selectedTimeButton: {
    backgroundColor: '#2685BF',
    borderColor: '#2685BF',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedTimeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  customTimeContainer: {
    marginTop: 16,
  },
  customTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  customTimeInputContainer: {
    alignItems: 'flex-start',
  },
  customTimeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: 120,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  customTimeExample: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  selectedInfo: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedLabel: {
    fontSize: 12,
    color: '#2685BF',
    marginBottom: 4,
    fontWeight: '600',
  },
  selectedDateTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2685BF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2685BF',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DateTimePickerCompleto;