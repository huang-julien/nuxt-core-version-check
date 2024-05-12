import { defineNuxtModule } from '@nuxt/kit'
import { resolvePath } from 'mlly'
import { readPackageJSON } from 'pkg-types'

const corePackages = [
  '@nuxt/schema',
  '@nuxt/kit',
]

export default defineNuxtModule({
  meta: {
    name: 'nuxt-core-version-check',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_, nuxt) {
    const nuxtVersion = nuxt._version

    for (const pkg of corePackages) {
      const path = await resolvePath(pkg).catch(() => null)

      if (!path) continue
      const { version } = await readPackageJSON(path)

      if (version !== nuxtVersion) {
        console.error(`Version mismatch for ${pkg} and nuxt: expected ${nuxtVersion} (nuxt) but got ${version}`)
      }
    }
  },
})
