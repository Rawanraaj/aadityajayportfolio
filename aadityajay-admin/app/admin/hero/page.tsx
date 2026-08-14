'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { logAudit } from '@/lib/audit';
import { type Hero } from '@/lib/types';
import { PageHeader } from '@/components/admin/page-header';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { LoadingState } from '@/components/admin/empty-states';
import { toast } from 'sonner';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';

export default function HeroPage() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroPhoto, setHeroPhoto] = useState<string | null>(null);
  const [tagline, setTagline] = useState('');
  const [statYears, setStatYears] = useState('0');
  const [statStories, setStatStories] = useState('0');
  const [statRecognitions, setStatRecognitions] = useState('0');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      if (error) {
        toast.error('Failed to load hero content');
        setLoading(false);
        return;
      }
      if (data) {
        const h = data as Hero;
        setHero(h);
        setHeroPhoto(h.hero_photo_url);
        setTagline(h.tagline ?? '');
        setStatYears(h.stat_years.toString());
        setStatStories(h.stat_stories.toString());
        setStatRecognitions(h.stat_recognitions.toString());
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const payload = {
      id: 1,
      hero_photo_url: heroPhoto,
      tagline: tagline.trim() || null,
      stat_years: parseInt(statYears, 10) || 0,
      stat_stories: parseInt(statStories, 10) || 0,
      stat_recognitions: parseInt(statRecognitions, 10) || 0,
    };

    if (hero) {
      const { error } = await supabase.from('hero').update(payload).eq('id', 1);
      setSaving(false);
      if (error) {
        toast.error('Save failed: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('hero').insert(payload);
      setSaving(false);
      if (error) {
        toast.error('Save failed: ' + error.message);
        return;
      }
    }

    await logAudit({
      action: 'update',
      target_type: 'hero',
      target_id: '1',
      details: 'Updated hero content',
    });
    toast.success('Hero content saved');
  }, [hero, heroPhoto, tagline, statYears, statStories, statRecognitions]);

  if (loading) return <LoadingState label="Loading hero content…" />;

  const STATS = [
    { key: 'statYears', label: 'Years Reporting', value: statYears, set: setStatYears },
    { key: 'statStories', label: 'Stories Published', value: statStories, set: setStatStories },
    { key: 'statRecognitions', label: 'National Recognitions', value: statRecognitions, set: setStatRecognitions },
  ];

  return (
    <div className="animate-fade-in pb-20">
      <PageHeader
        eyebrow="Homepage"
        title="Hero Content"
        description="The main hero section shown at the top of the public site."
        actions={
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Photo */}
        <Card className="p-5 bg-card/60 border-border">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-4 h-4 text-primary" />
            <h3 className="font-display text-base font-semibold">Hero Photo</h3>
          </div>
          <ImageUpload
            value={heroPhoto}
            onChange={setHeroPhoto}
            folder="hero"
            aspect="square"
            label="Portrait photo"
          />
        </Card>

        {/* Content */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5 bg-card/60 border-border space-y-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tagline</Label>
              <Textarea
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="A bold line that defines the journalist's mission…"
                rows={3}
                className="bg-background-soft border-border resize-none font-display text-lg"
              />
            </div>
          </Card>

          <Card className="p-5 bg-card/60 border-border">
            <h3 className="font-display text-base font-semibold mb-4">Stat Numbers</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div key={s.key} className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={s.value}
                    onChange={(e) => s.set(e.target.value)}
                    className="bg-background-soft border-border text-center text-2xl font-display font-bold"
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-4">
              These appear as large numbers in the hero section.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
