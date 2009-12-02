#!/usr/bin/perl

=head1 NAME

generate-form.pl - create form html from config file using HTML::FormFu

=head1 SYNOPSIS

    generate-form.pl [--out GENERATED_FORM_FILE] [--in FORM_CONFIG]
    	--in  FormFu yaml config filename (default stdin)
	    --out filename where to write the output (default stdout)
    
    Example:
        script/generate-form.pl --out tt-lib/forms/feedback.tt2 --in etc/forms/feedback.yaml

=head1 DESCRIPTION

=cut


use strict;
use warnings;

use Getopt::Long;
use Pod::Usage;

use YAML::Syck 'LoadFile', 'Dump', 'Load';
use HTML::FormFu;

use FindBin '$Bin';
use lib $Bin.'/../lib/';

our @LANGS = ('sk', 'en');

exit main();

sub main {
    my $help;
    my $output_filename;
    my $config_filename;
    GetOptions(
        'help|h'   => \$help,
        'out|o=s'  => \$output_filename,
        'in|i=s'   => \$config_filename,
    ) or pod2usage;
    pod2usage
    	if $help;
    pod2usage
    	if (@ARGV > 0);
    
    open STDOUT, '>', $output_filename or die("Can't open ", $output_filename, ': ', $!)
    	if $output_filename;
    
    my $cfg  = LoadFile($config_filename || \*STDIN);
    
    foreach my $lang (@LANGS) {
        my $cfg_copy = Load(Dump($cfg));
        
        print '[% IF lang == "'.$lang.'" %]', "\n";
        my $form = HTML::FormFu->new({
            'languages'      => [ $lang ],
            'localize_class' => 'BA::PM::I18N',
        });

        $form->populate($cfg_copy);
        print $form;
        print '[% END %]', "\n";
    }
    
    return 0;
}

