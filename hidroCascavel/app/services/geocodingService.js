// services/geocodingService.js
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    // Usando a API gratuita do Nominatim (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=pt-BR,pt`
    );
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      
      // Para zonas rurais, tentamos obter informações mais específicas
      let rua = address.road || address.pedestrian || '';
      let numero = address.house_number || '';
      let bairro = address.suburb || address.village || address.hamlet || '';
      let cidade = address.city || address.town || address.village || '';
      let estado = address.state || '';
      let cep = address.postcode || '';
      
      // Se estiver em zona rural, tentamos obter informações mais específicas
      if (!rua && address.hamlet) {
        rua = `Localidade: ${address.hamlet}`;
      }
      
      if (!cidade && address.county) {
        cidade = address.county;
      }
      
      // Para áreas rurais, usar o município como cidade se não houver cidade
      if (!cidade && address.municipality) {
        cidade = address.municipality;
      }
      
      const enderecoCompleto = [
        rua,
        numero ? `Nº ${numero}` : '',
        bairro,
        cidade,
        estado
      ].filter(Boolean).join(', ');
      
      return {
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        enderecoCompleto: enderecoCompleto || data.display_name || 'Localização rural'
      };
    }
    
    throw new Error('Endereço não encontrado');
  } catch (error) {
    console.error('Erro no geocoding:', error);
    
    // Fallback: retornar apenas as coordenadas se a API falhar
    return {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      enderecoCompleto: `Localização rural (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
    };
  }
};

// Função adicional para buscar coordenadas a partir de um endereço (opcional)
export const getCoordinatesFromAddress = async (endereco) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1&accept-language=pt-BR,pt`
    );
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    
    throw new Error('Localização não encontrada');
  } catch (error) {
    console.error('Erro no geocoding inverso:', error);
    throw error;
  }
};