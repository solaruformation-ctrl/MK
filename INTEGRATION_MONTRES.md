# Intégration des Montres Connectées

Ce guide explique comment intégrer les données de montres connectées (Apple Watch, Amazfit, Google Fit, etc.) dans votre application MK Form.

## État Actuel

L'application est configurée pour recevoir et afficher les données de santé depuis la base de données Supabase. Les données sont actuellement des exemples, mais la structure est prête pour recevoir des données réelles.

## Limitations Importantes

**Expo Go ne supporte pas les packages natifs** requis pour accéder aux données des montres. Pour intégrer les montres connectées, vous devez:

1. Créer un **Development Build** avec Expo
2. Installer les packages natifs nécessaires
3. Configurer les permissions sur iOS et Android

## Solutions d'Intégration

### Option 1: Apple Watch (iOS uniquement)

#### Installation

```bash
npx expo install react-native-health
```

#### Configuration

Ajoutez dans `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSHealthShareUsageDescription": "Cette app utilise vos données de santé pour suivre votre activité physique",
        "NSHealthUpdateUsageDescription": "Cette app souhaite enregistrer vos données de santé"
      }
    },
    "plugins": [
      [
        "react-native-health",
        {
          "healthSharePermission": "Permettre à MK Form d'accéder à vos données de santé"
        }
      ]
    ]
  }
}
```

#### Code d'Intégration

```typescript
import AppleHealthKit, { HealthValue } from 'react-native-health';

// Demander les permissions
const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.AppleExerciseTime,
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
    ],
  },
};

AppleHealthKit.initHealthKit(permissions, (error) => {
  if (error) {
    console.log('Erreur HealthKit:', error);
    return;
  }

  // Récupérer les pas d'aujourd'hui
  const options = {
    date: new Date().toISOString(),
    includeManuallyAdded: true,
  };

  AppleHealthKit.getStepCount(options, async (err, results) => {
    if (err) return;

    // Sauvegarder dans Supabase
    await supabase.from('health_data').upsert({
      date: new Date().toISOString().split('T')[0],
      steps: results.value,
      source: 'apple_watch',
    });
  });

  // Récupérer les calories
  AppleHealthKit.getActiveEnergyBurned(options, async (err, results) => {
    if (err) return;

    await supabase.from('health_data').upsert({
      date: new Date().toISOString().split('T')[0],
      calories: Math.round(results.value),
      source: 'apple_watch',
    });
  });

  // Récupérer le rythme cardiaque
  AppleHealthKit.getHeartRateSamples(options, async (err, results) => {
    if (err || !results.length) return;

    const heartRates = results.map(r => r.value);
    const avg = Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length);
    const max = Math.max(...heartRates);
    const min = Math.min(...heartRates);

    await supabase.from('health_data').upsert({
      date: new Date().toISOString().split('T')[0],
      heart_rate_avg: avg,
      heart_rate_max: max,
      heart_rate_min: min,
      source: 'apple_watch',
    });
  });
});
```

### Option 2: Google Fit (Android)

#### Installation

```bash
npx expo install react-native-google-fit
```

#### Configuration

Ajoutez dans `app.json`:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.ACTIVITY_RECOGNITION"
      ]
    }
  }
}
```

#### Code d'Intégration

```typescript
import GoogleFit, { Scopes } from 'react-native-google-fit';

// Configurer Google Fit
const options = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_LOCATION_READ,
  ],
};

GoogleFit.authorize(options)
  .then(async (authResult) => {
    if (authResult.success) {
      // Récupérer les pas
      const today = new Date();
      const startDate = new Date(today.setHours(0, 0, 0, 0));

      GoogleFit.getDailyStepCountSamples({ startDate })
        .then(async (res) => {
          if (res.length > 0) {
            const steps = res[0].steps.reduce((sum, day) => sum + day.value, 0);

            await supabase.from('health_data').upsert({
              date: new Date().toISOString().split('T')[0],
              steps: steps,
              source: 'google_fit',
            });
          }
        });

      // Récupérer les calories
      GoogleFit.getDailyCalorieSamples({ startDate })
        .then(async (res) => {
          if (res.length > 0) {
            const calories = Math.round(res[0].calorie);

            await supabase.from('health_data').upsert({
              date: new Date().toISOString().split('T')[0],
              calories: calories,
              source: 'google_fit',
            });
          }
        });
    }
  });
```

### Option 3: Amazfit / Zepp

Amazfit utilise l'application Zepp. Pour intégrer:

1. **Via API Zepp** (nécessite compte développeur)
   - Inscription sur [Zepp Developer Platform](https://developer.zepp.com/)
   - Obtenir les clés API
   - Utiliser l'API REST pour récupérer les données

2. **Via Google Fit / Apple Health**
   - Amazfit peut synchroniser avec Google Fit ou Apple Health
   - Utilisez les options 1 ou 2 ci-dessus

### Option 4: Synchronisation Manuelle (Actuellement Actif)

En attendant l'intégration native, les utilisateurs peuvent:

1. Aller dans l'onglet **Admin**
2. Ajouter une nouvelle entrée dans la table `health_data`
3. Remplir manuellement les données

Ou créer une API qui reçoit les données depuis des services tiers.

## Structure de la Base de Données

Table `health_data`:
- `date`: Date des données
- `steps`: Nombre de pas
- `distance`: Distance en km
- `calories`: Calories brûlées
- `active_minutes`: Minutes d'activité
- `heart_rate_avg`: Fréquence cardiaque moyenne
- `heart_rate_max`: Fréquence cardiaque maximale
- `heart_rate_min`: Fréquence cardiaque minimale
- `sleep_hours`: Heures de sommeil
- `weight`: Poids en kg
- `source`: Source des données (apple_watch, google_fit, amazfit, manual)

## Création d'un Development Build

Pour utiliser les packages natifs:

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Créer un build de développement
eas build --profile development --platform ios
# ou
eas build --profile development --platform android
```

Ensuite, installez l'application sur votre appareil et lancez:

```bash
npx expo start --dev-client
```

## Synchronisation en Temps Réel

Pour synchroniser automatiquement les données toutes les heures:

```typescript
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch-health-data';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    // Récupérer les données depuis HealthKit/Google Fit
    // Sauvegarder dans Supabase
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Enregistrer la tâche
await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  minimumInterval: 60 * 60, // 1 heure
  stopOnTerminate: false,
  startOnBoot: true,
});
```

## Prochaines Étapes

1. Créer un Development Build
2. Choisir votre plateforme (iOS, Android, ou les deux)
3. Installer les packages appropriés
4. Implémenter le code d'intégration
5. Tester sur un appareil physique avec une montre connectée
6. Configurer la synchronisation automatique

## Support

Les données de montres connectées sont maintenant visibles dans l'onglet **Profil** de l'application avec:
- Statistiques du jour (pas, calories, minutes actives, sommeil)
- Fréquence cardiaque moyenne et maximale
- Moyennes hebdomadaires
- Objectifs quotidiens

Pour toute question, consultez:
- [Documentation Expo](https://docs.expo.dev/)
- [react-native-health](https://github.com/agencyenterprise/react-native-health)
- [react-native-google-fit](https://github.com/StasDoskalenko/react-native-google-fit)
