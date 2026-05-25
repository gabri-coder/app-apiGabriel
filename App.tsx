import { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [cidade, setCidade] = useState('');
  const [dados, setDados] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function buscarClima() {
    if (!cidade.trim()) {
      alert('Digite uma cidade');
      return;
    }

    try {
      setLoading(true);

      // 1. Busca coordenadas da cidade
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cidade
        )}&count=1&language=pt&format=json`
      );

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert('Cidade não encontrada');
        return;
      }

      const local = geoData.results[0];

      // 2. Busca clima usando latitude e longitude
      const climaResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current_weather=true`
      );

      const climaData = await climaResponse.json();

      setDados({
        cidade: local.name,
        pais: local.country,
        temperatura: climaData.current_weather.temperature,
        vento: climaData.current_weather.windspeed,
      });
    } catch (error) {
      alert('Erro ao buscar clima');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.card}>
        <Text style={styles.title}>🌤 Clima Agora</Text>

        <Text style={styles.subtitle}>
          Consulte o clima em tempo real
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite uma cidade"
          placeholderTextColor="#94A3B8"
          value={cidade}
          onChangeText={setCidade}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={buscarClima}
        >
          <Text style={styles.buttonText}>
            Buscar Clima
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#38BDF8"
            style={{ marginTop: 25 }}
          />
        )}

        {dados && !loading && (
          <View style={styles.resultado}>
            <Text style={styles.city}>
              {dados.cidade}
            </Text>

            <Text style={styles.country}>
              {dados.pais}
            </Text>

            <Text style={styles.temp}>
              {Math.round(dados.temperatura)}°C
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>
                Velocidade do vento
              </Text>

              <Text style={styles.infoText}>
                {dados.vento} km/h
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#0F172A',
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: '#1E293B',
  },

  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
    fontSize: 15,
  },

  input: {
    backgroundColor: '#1E293B',
    color: '#FFF',
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },

  button: {
    backgroundColor: '#38BDF8',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 16,
  },

  resultado: {
    alignItems: 'center',
    marginTop: 35,
  },

  city: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  country: {
    color: '#94A3B8',
    fontSize: 18,
    marginTop: 5,
  },

  temp: {
    color: '#FFF',
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 20,
  },

  infoBox: {
    width: '100%',
    backgroundColor: '#1E293B',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },

  infoLabel: {
    color: '#94A3B8',
    fontSize: 15,
    marginBottom: 6,
  },

  infoText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
});