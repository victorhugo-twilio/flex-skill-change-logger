// Flex Plugin: Log skill changes via WorkerSkills (UI v2.x) — with diff (added/removed)
import { FlexPlugin } from '@twilio/flex-plugin';
import { Manager } from '@twilio/flex-ui';

const PLUGIN_NAME = 'PluginSkillLoggerPlugin';

export default class PluginSkillLoggerPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    console.log('[SkillLoggerPlugin] init');

    // Snapshot inicial de atributos do worker logado (para diff)
    let previousAttributes = manager?.workerClient?.attributes || {};

    const getSkills = (attrs) => {
      try {
        return Array.isArray(attrs?.routing?.skills) ? attrs.routing.skills : [];
      } catch (_) {
        return [];
      }
    };

    const diffSkills = (prev, curr) => {
      const prevSet = new Set(getSkills(prev));
      const currSet = new Set(getSkills(curr));
      const added = [...currSet].filter((s) => !prevSet.has(s));
      const removed = [...prevSet].filter((s) => !currSet.has(s));
      return { added, removed };
    };

    // Flex UI v2.x Flex Events: workerAttributesUpdated
    manager.events.addListener('workerAttributesUpdated', (newAttributes) => {
      try {
        const workerSid = manager?.workerClient?.sid;
        const changedBy = manager?.user?.identity;
        const { added, removed } = diffSkills(previousAttributes, newAttributes);

        console.log('[SkillLoggerPlugin] workerAttributesUpdated', {
          workerSid,
          added,
          removed,
          newSkills: getSkills(newAttributes),
        });

        fetch('https://your-backend-domain.com/api/log-skill-change', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workerSid,
            changedBy,
            newAttributes,
            addedSkills: added,
            removedSkills: removed,
            source: 'flex-ui',
            timestamp: new Date().toISOString(),
          }),
        });

        // Atualiza snapshot para o próximo diff
        previousAttributes = newAttributes;
      } catch (e) {
        console.error('[SkillLoggerPlugin] error posting update', e);
      }
    });
  }
}
