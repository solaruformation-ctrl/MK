# Système de Notifications Motivationnelles

Ce document décrit le système de notifications motivationnelles de MK FORM qui a été implémenté dans l'application.

## Vue d'ensemble

L'application envoie des notifications motivationnelles quotidiennes pour encourager les utilisateurs à atteindre leurs objectifs de fitness. Il y a deux types de notifications :

- **Notifications du matin** : Messages motivants pour bien commencer la journée (par défaut à 8h00)
- **Notifications du soir** : Messages d'encouragement avant de dormir (par défaut à 21h00)

## Fonctionnalités Implémentées

### 1. Messages Motivationnels

**15 messages motivationnels pour le matin** :
- "🔥 Lâche rien ! Aujourd'hui est ton jour pour briller !"
- "💪 Ton potentiel est infini, montre-le !"
- "⚡ Chaque effort compte, tu es sur la bonne voie !"
- "🎯 Reste focus, tes objectifs t'attendent !"
- "🌟 Tu es plus fort que tu ne le penses !"
- Et 10 autres messages...

**5 messages pour le soir** :
- "🌙 Bien joué aujourd'hui ! Repose-toi bien."
- "✨ Tu as progressé aujourd'hui, bravo !"
- "💤 Une bonne récupération pour être au top demain !"
- Et 2 autres messages...

### 2. Configuration Personnalisée

Les utilisateurs peuvent :
- ✅ Activer/désactiver les notifications du matin et du soir indépendamment
- ✅ Choisir l'heure exacte de réception (heures et minutes)
- ✅ Voir leurs préférences sauvegardées en temps réel dans Supabase
- ✅ Ajuster l'heure par pas de 15 minutes pour les minutes
- ✅ Ajuster l'heure par incrément de 1 heure

### 3. Permissions

L'application demande automatiquement les permissions de notification :
- Au premier lancement de l'application
- Lorsque l'utilisateur active une notification pour la première fois

## Architecture Technique

### Fichiers Créés

#### 1. `lib/notifications.ts`
Service de gestion des notifications contenant :
- `requestNotificationPermissions()` : Demande les permissions
- `scheduleDailyMotivation(hour, minute)` : Planifie les notifications du matin
- `scheduleEveningMotivation(hour, minute)` : Planifie les notifications du soir
- `cancelAllNotifications()` : Annule toutes les notifications
- `getScheduledNotifications()` : Liste les notifications planifiées
- Tableaux de messages motivationnels

#### 2. `components/NotificationSettings.tsx`
Interface de configuration avec :
- Contrôles d'activation/désactivation (Switch)
- Sélecteurs d'heure avec boutons +/-
- Sauvegarde automatique dans Supabase
- Gestion des permissions
- Interface différente sur web (message d'information)

#### 3. `hooks/useNotifications.ts`
Hook d'initialisation qui :
- Se charge au démarrage de l'app
- Charge les préférences depuis Supabase
- Planifie automatiquement les notifications actives
- Utilise les valeurs par défaut si aucune préférence n'existe

#### 4. `app/notifications.tsx`
Écran de paramètres avec :
- Bouton retour vers le profil
- Intégration du composant NotificationSettings
- Navigation propre avec expo-router

### Base de Données Supabase

**Table `notification_preferences`** créée via migration :

```sql
CREATE TABLE notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  morning_enabled boolean DEFAULT true,
  morning_time_hour integer DEFAULT 8,
  morning_time_minute integer DEFAULT 0,
  evening_enabled boolean DEFAULT true,
  evening_time_hour integer DEFAULT 21,
  evening_time_minute integer DEFAULT 0,
  push_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
```

**Politiques RLS** :
- Les utilisateurs authentifiés peuvent lire/modifier leurs propres préférences
- Accès public temporaire pour le développement

**Index** :
- Index sur `user_id` pour des requêtes rapides

### Intégration dans l'Application

#### app/_layout.tsx
```typescript
import { useNotifications } from '@/hooks/useNotifications';

export default function RootLayout() {
  useFrameworkReady();
  useNotifications(); // Initialise les notifications au démarrage

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="notifications" /> // Route ajoutée
    </Stack>
  );
}
```

#### app/(tabs)/profile.tsx
Navigation ajoutée vers l'écran de notifications :
```typescript
const handleMenuPress = (screen: string) => {
  if (screen === 'notifications') {
    router.push('/notifications');
  }
};
```

## Utilisation

### Accès aux Paramètres

1. Ouvrir l'application
2. Aller dans l'onglet **Profil** (en bas)
3. Cliquer sur **Notifications** dans le menu "Compte"
4. Activer/désactiver les notifications avec les switches
5. Ajuster les heures avec les boutons +/-

### Comportement par Défaut

Si aucune préférence n'est configurée :
- ✅ Notifications du matin activées à **8h00**
- ✅ Notifications du soir activées à **21h00**
- Les deux types de notifications sont activés par défaut

### Première Utilisation

1. L'app demande les permissions de notification au premier lancement
2. Si refusé, l'utilisateur peut réactiver dans les paramètres système
3. Les notifications sont planifiées automatiquement au démarrage

## Limitations et Comportements

### Plateforme Web
- ❌ Les notifications push ne fonctionnent pas sur web
- ✅ Un message informatif est affiché aux utilisateurs web
- Les utilisateurs web voient : "Les notifications push ne sont pas disponibles sur le web"

### iOS
- Nécessite la permission explicite de l'utilisateur
- L'utilisateur doit autoriser dans les paramètres iOS si refusé initialement

### Android
- Notifications activées par défaut
- Peut être désactivé dans les paramètres système
- Sur Android 13+, permission POST_NOTIFICATIONS requise

## Test des Notifications

### En Développement

Pour tester rapidement :
1. Activer les notifications dans l'app
2. Régler une heure proche (ex: 1-2 minutes dans le futur)
3. Mettre l'app en arrière-plan
4. Attendre la notification

### Vérifier les Notifications Planifiées

Dans le code, vous pouvez utiliser :
```typescript
import { getScheduledNotifications } from '@/lib/notifications';

const scheduled = await getScheduledNotifications();
console.log('Notifications planifiées:', scheduled);
```

### Annuler Toutes les Notifications

```typescript
import { cancelAllNotifications } from '@/lib/notifications';

await cancelAllNotifications();
```

## Messages Aléatoires

- Les messages sont sélectionnés **aléatoirement** à chaque notification
- Cela évite la monotonie et maintient l'engagement
- 15 variations pour le matin, 5 pour le soir

## Flux de Données

```
1. Utilisateur ouvre l'app
   ↓
2. useNotifications() charge les préférences depuis Supabase
   ↓
3. Si préférences existent → planifie selon les préférences
   Si aucune préférence → planifie avec valeurs par défaut
   ↓
4. Utilisateur modifie les paramètres dans NotificationSettings
   ↓
5. Sauvegarde automatique dans Supabase
   ↓
6. Annulation des anciennes notifications
   ↓
7. Replanification avec les nouvelles heures
```

## Dépendances Installées

```json
{
  "expo-notifications": "^0.28.x"
}
```

## Fichiers Modifiés

1. ✅ `package.json` - Ajout d'expo-notifications
2. ✅ `app/_layout.tsx` - Hook useNotifications + route notifications
3. ✅ `app/(tabs)/profile.tsx` - Navigation vers /notifications
4. ✅ Migration Supabase - Table notification_preferences

## Fichiers Créés

1. ✅ `lib/notifications.ts`
2. ✅ `components/NotificationSettings.tsx`
3. ✅ `hooks/useNotifications.ts`
4. ✅ `app/notifications.tsx`
5. ✅ `supabase/migrations/create_notification_preferences_table.sql`

## Améliorations Futures Possibles

- [ ] Notifications basées sur le profil utilisateur (onboarding)
- [ ] Rappels pour les séances d'entraînement planifiées
- [ ] Notifications contextuelles (félicitations après une séance)
- [ ] Intégration avec les données de santé pour des messages personnalisés
- [ ] Support des notifications riches (images, actions)
- [ ] Catégories de notifications personnalisables
- [ ] Statistiques d'engagement avec les notifications
- [ ] A/B testing des messages
- [ ] Notifications push depuis un serveur (Expo Push API)

## Troubleshooting

### Les notifications ne s'affichent pas

1. Vérifier les permissions dans les paramètres de l'appareil
2. Tester sur un **appareil physique** (pas l'émulateur)
3. Vérifier que le mode "Ne pas déranger" est désactivé
4. Vérifier que les notifications sont activées dans l'app

### Les horaires sont incorrects

1. Vérifier le fuseau horaire de l'appareil
2. Les heures sont en **temps local** (pas UTC)

### Notifications en double

- Le code appelle `cancelAllNotifications()` avant de planifier
- Si problème persiste, vérifier qu'il n'y a pas plusieurs appels à `scheduleDailyMotivation`

### Permission refusée sur iOS

1. Aller dans Réglages iOS → Notifications → MK FORM
2. Activer "Autoriser les notifications"
3. Redémarrer l'app

## Notes Importantes

- ⚠️ Les notifications locales ne fonctionnent **que sur mobile** (iOS/Android)
- ⚠️ Tester sur un **appareil physique** pour un comportement réaliste
- ✅ Les préférences sont **persistées dans Supabase**
- ✅ Les notifications sont **locales** (pas besoin de serveur)
- ✅ Messages **aléatoires** pour éviter la répétition

## Résumé

Le système de notifications motivationnelles est **complètement fonctionnel** et permet aux utilisateurs de recevoir des messages d'encouragement personnalisables chaque jour. L'interface est intuitive, les données sont sauvegardées dans Supabase, et le système fonctionne de manière autonome une fois configuré.
