import React, { useEffect, useState } from 'react';
import { productService, serviceService, tattooArtistService } from '../services/api';
import { useStudioMcp } from '../context/StudioMcpContext';

export default function Debug() {
  const [rawArtists, setRawArtists] = useState(null);
  const [services, setServices] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  // Datos del contexto StudioMcp
  const { artists: contextArtists, isLoading: contextLoading } = useStudioMcp();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('📡 Cargando artistas RAW desde API...');
        const artistsData = await tattooArtistService.getAll();
        console.log('✓ Artistas RAW:', artistsData);
        setRawArtists(artistsData);
      } catch (err) {
        console.error('✗ Error artistas:', err);
        setErrors(prev => ({ ...prev, artists: err.message }));
      }

      try {
        console.log('📡 Cargando servicios...');
        const servicesData = await serviceService.getAll();
        console.log('✓ Servicios:', servicesData);
        setServices(servicesData);
      } catch (err) {
        console.error('✗ Error servicios:', err);
        setErrors(prev => ({ ...prev, services: err.message }));
      }

      try {
        console.log('📡 Cargando productos...');
        const productsData = await productService.getAll();
        console.log('✓ Productos:', productsData);
        setProducts(productsData);
      } catch (err) {
        console.error('✗ Error productos:', err);
        setErrors(prev => ({ ...prev, products: err.message }));
      }

      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#1e1e1e', color: '#fff' }}>
      <h1>🔧 Debug API & Context</h1>
      
      {loading && <p>Cargando datos...</p>}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#2d2d2d', borderRadius: '4px' }}>
        <h2>📊 Estado del Contexto StudioMcp</h2>
        <p>Loading: {contextLoading ? 'Sí' : 'No'}</p>
        <p>Artistas en contexto: {contextArtists?.length || 0}</p>
        {contextArtists?.length > 0 && (
          <div>
            <p>Primer artista:</p>
            <pre style={{ fontSize: '11px', maxHeight: '150px', overflow: 'auto' }}>
              {JSON.stringify(contextArtists[0], null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#2d2d2d', borderRadius: '4px' }}>
        <h2>🎨 Artistas RAW (desde API)</h2>
        {errors.artists ? (
          <pre style={{ color: '#ff6b6b' }}>{errors.artists}</pre>
        ) : rawArtists ? (
          <div>
            <p>Total: {rawArtists.data?.length || 0}</p>
            <pre style={{ fontSize: '11px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(rawArtists, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Sin datos</p>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#2d2d2d', borderRadius: '4px' }}>
        <h2>✏️ Servicios</h2>
        {errors.services ? (
          <pre style={{ color: '#ff6b6b' }}>{errors.services}</pre>
        ) : services ? (
          <div>
            <p>Total: {services.data?.length || 0}</p>
            <pre style={{ fontSize: '11px', maxHeight: '150px', overflow: 'auto' }}>
              {JSON.stringify(services, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Sin datos</p>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#2d2d2d', borderRadius: '4px' }}>
        <h2>🧴 Productos</h2>
        {errors.products ? (
          <pre style={{ color: '#ff6b6b' }}>{errors.products}</pre>
        ) : products ? (
          <div>
            <p>Total: {products.data?.length || 0}</p>
            <pre style={{ fontSize: '11px', maxHeight: '150px', overflow: 'auto' }}>
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        ) : (
          <p>Sin datos</p>
        )}
      </div>
    </div>
  );
}
