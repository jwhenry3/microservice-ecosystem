export class AbilityPrerequisite {
  level           = 0;
  // can be quest, scroll bought from store, etc
  flag          = false;
  // must be x class to access this skill
  class?: string  = null;
  // equiped x weapon and now you can use the ability
  weapon?: string = null;

}
