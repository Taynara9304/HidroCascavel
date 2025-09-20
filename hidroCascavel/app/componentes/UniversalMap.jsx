// components/UniversalMap.jsx (alternativa)
import React from 'react';
import WebMap from './WebMap';

// Usar WebMap em todas as plataformas para evitar problemas de compatibilidade
const UniversalMap = (props) => {
  return <WebMap {...props} />;
};

export default UniversalMap;